import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix, accuracy_score
from sklearn.preprocessing import LabelEncoder

class MLEngine:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(__file__))
        self.model_dir = os.path.join(self.base_dir, "models")
        self.data_dir = os.path.join(self.base_dir, "data")
        os.makedirs(self.model_dir, exist_ok=True)
        os.makedirs(self.data_dir, exist_ok=True)

        self.model_path = os.path.join(self.model_dir, "engagement_rf_model.joblib")
        self.meta_path = os.path.join(self.model_dir, "model_meta.joblib")
        self.data_path = os.path.join(self.data_dir, "social_posts_dataset.csv")

        self.model = None
        self.encoders = {}
        self.metrics = {}
        self.feature_names = [
            "platform", "category", "day_of_week", "hour_of_day",
            "caption_length", "hashtag_count", "has_cta", "media_type"
        ]

        # Initialize or train
        if os.path.exists(self.model_path) and os.path.exists(self.meta_path):
            self.load_model()
        else:
            self.train_and_save()

    def generate_synthetic_dataset(self, n_samples=1200):
        np.random.seed(42)
        platforms = ["Facebook", "Instagram", "LinkedIn", "Twitter"]
        categories = ["Fashion", "Electronics", "Food & Beverage", "Beauty & Personal Care", "Home & Living"]
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        media_types = ["Image", "Video", "Carousel", "Text"]

        data = []
        for _ in range(n_samples):
            platform = np.random.choice(platforms)
            category = np.random.choice(categories)
            day = np.random.choice(days)
            hour = np.random.randint(0, 24)
            caption_len = int(np.random.normal(120, 50))
            caption_len = max(20, min(500, caption_len))
            hashtag_count = int(np.random.poisson(4))
            has_cta = np.random.choice([1, 0], p=[0.7, 0.3])
            media = np.random.choice(media_types, p=[0.45, 0.35, 0.15, 0.05])

            # Scoring heuristics for realistic ground truth
            score = 0
            # Prime hours (18-21 and 12-14)
            if (18 <= hour <= 21) or (12 <= hour <= 14):
                score += 3
            if media in ["Video", "Carousel"]:
                score += 2
            if has_cta == 1:
                score += 1.5
            if 3 <= hashtag_count <= 8:
                score += 1
            if day in ["Thursday", "Friday", "Saturday"]:
                score += 1

            noise = np.random.normal(0, 1)
            total = score + noise

            if total >= 6:
                engagement = "High"
            elif total >= 3.5:
                engagement = "Medium"
            else:
                engagement = "Low"

            data.append({
                "platform": platform,
                "category": category,
                "day_of_week": day,
                "hour_of_day": hour,
                "caption_length": caption_len,
                "hashtag_count": hashtag_count,
                "has_cta": has_cta,
                "media_type": media,
                "engagement_level": engagement,
            })

        df = pd.DataFrame(data)
        df.to_csv(self.data_path, index=False)
        return df

    def train_and_save(self):
        if not os.path.exists(self.data_path):
            df = self.generate_synthetic_dataset()
        else:
            df = pd.read_csv(self.data_path)

        categorical_cols = ["platform", "category", "day_of_week", "media_type"]
        df_encoded = df.copy()

        self.encoders = {}
        for col in categorical_cols:
            le = LabelEncoder()
            df_encoded[col] = le.fit_transform(df[col])
            self.encoders[col] = le

        target_le = LabelEncoder()
        df_encoded["engagement_level"] = target_le.fit_transform(df["engagement_level"])
        self.encoders["target"] = target_le

        X = df_encoded[self.feature_names]
        y = df_encoded["engagement_level"]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        rf = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=4,
            random_state=42
        )
        rf.fit(X_train, y_train)

        # Evaluate model
        y_pred = rf.predict(X_test)
        target_names = list(target_le.classes_)

        precision = precision_score(y_test, y_pred, average="weighted")
        recall = recall_score(y_test, y_pred, average="weighted")
        f1 = f1_score(y_test, y_pred, average="weighted")
        accuracy = accuracy_score(y_test, y_pred)
        cm = confusion_matrix(y_test, y_pred).tolist()

        feature_importances = {
            name: round(float(imp), 4)
            for name, imp in zip(self.feature_names, rf.feature_importances_)
        }

        self.metrics = {
            "model_type": "Random Forest Classifier",
            "accuracy": round(float(accuracy), 4),
            "precision": round(float(precision), 4),
            "recall": round(float(recall), 4),
            "f1_score": round(float(f1), 4),
            "confusion_matrix": cm,
            "classes": target_names,
            "feature_importances": feature_importances,
            "train_samples": len(X_train),
            "test_samples": len(X_test),
        }

        self.model = rf

        # Persist
        joblib.dump(rf, self.model_path)
        joblib.dump({"encoders": self.encoders, "metrics": self.metrics}, self.meta_path)
        return self.metrics

    def load_model(self):
        self.model = joblib.load(self.model_path)
        meta = joblib.load(self.meta_path)
        self.encoders = meta["encoders"]
        self.metrics = meta["metrics"]

    def predict(self, data: dict):
        if not self.model:
            self.train_and_save()

        # Encode input
        encoded_row = []
        for col in self.feature_names:
            val = data.get(col)
            if col in self.encoders:
                le = self.encoders[col]
                # Fallback to class 0 if unseen
                try:
                    enc_val = int(le.transform([val])[0])
                except Exception:
                    enc_val = 0
                encoded_row.append(enc_val)
            else:
                encoded_row.append(float(val if val is not None else 0))

        X_input = [encoded_row]
        pred_idx = self.model.predict(X_input)[0]
        pred_label = self.encoders["target"].inverse_transform([pred_idx])[0]
        probabilities = self.model.predict_proba(X_input)[0]

        prob_dict = {
            cls: round(float(prob), 3)
            for cls, prob in zip(self.encoders["target"].classes_, probabilities)
        }

        # Predict best posting hour across 0..23 for this day and platform
        best_hour = self.predict_best_hour(data)

        return {
            "predicted_engagement": pred_label,
            "confidence": round(float(np.max(probabilities)), 3),
            "probabilities": prob_dict,
            "best_posting_hour": best_hour["best_hour"],
            "best_time_slot": best_hour["time_slot"],
            "hourly_engagement_scores": best_hour["scores"]
        }

    def predict_best_hour(self, base_data: dict):
        # Simulate all 24 hours to find peak probability of High engagement
        scores = []
        high_idx = list(self.encoders["target"].classes_).index("High") if "High" in self.encoders["target"].classes_ else 0

        for h in range(24):
            temp_data = base_data.copy()
            temp_data["hour_of_day"] = h

            encoded_row = []
            for col in self.feature_names:
                val = temp_data.get(col)
                if col in self.encoders:
                    try:
                        encoded_row.append(int(self.encoders[col].transform([val])[0]))
                    except Exception:
                        encoded_row.append(0)
                else:
                    encoded_row.append(float(val if val is not None else 0))

            probs = self.model.predict_proba([encoded_row])[0]
            scores.append(round(float(probs[high_idx]), 3))

        best_h = int(np.argmax(scores))
        slot_str = f"{best_h:02d}:00 - {(best_h + 2) % 24:02d}:00"

        return {
            "best_hour": best_h,
            "time_slot": slot_str,
            "scores": scores,
        }

ml_engine = MLEngine()
