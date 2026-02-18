import PageLayout from '@/components/layout/PageLayout';
import AlgorithmCard from '@/components/ui/AlgorithmCard';
import CodeBlock from '@/components/ui/CodeBlock';
import Callout from '@/components/ui/Callout';
import SectionHeader from '@/components/ui/SectionHeader';

const tocItems = [
  { id: 'ml-basics', label: 'ML Basics', level: 2 },
  { id: 'algorithms', label: 'Core Algorithms', level: 2 },
  { id: 'linear-regression', label: 'Linear Regression', level: 3 },
  { id: 'random-forest', label: 'Random Forest', level: 3 },
  { id: 'svm', label: 'SVM', level: 3 },
  { id: 'deep-learning', label: 'Deep Learning', level: 2 },
  { id: 'transformers', label: 'Transformers', level: 3 },
  { id: 'evaluation', label: 'Model Evaluation', level: 2 },
];

const linearRegressionCode = `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# Example: DoD Budget Forecasting
# Features: year, prior_year_budget, gdp_growth, inflation_rate
X = np.array([[2020, 700, 2.3, 1.8],
              [2021, 753, -3.4, 7.0],
              [2022, 782, 5.9, 8.0],
              [2023, 858, 2.1, 3.4]])
y = np.array([753, 782, 858, 886])  # Enacted budgets ($B)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(f"R² Score: {r2_score(y_test, y_pred):.4f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.2f}")
print(f"Coefficients: {model.coef_}")`;

const randomForestCode = `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
import pandas as pd

# Audit Risk Prediction Example
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=5,
    random_state=42,
    n_jobs=-1  # Use all CPU cores
)

model.fit(X_train, y_train)

# Feature importance (great for DoD audit reports)
feature_names = ['transaction_amount', 'vendor_history', 
                 'contract_type', 'fiscal_year', 'obligation_rate']
importance_df = pd.DataFrame({
    'feature': feature_names,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print(importance_df)

# Cross-validation
cv_scores = cross_val_score(model, X, y, cv=5)
print(f"CV Accuracy: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")`;

const transformerCode = `import torch
import torch.nn as nn

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model=512, num_heads=8):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
    
    def scaled_dot_product_attention(self, Q, K, V, mask=None):
        scores = torch.matmul(Q, K.transpose(-2, -1)) / (self.d_k ** 0.5)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        attention = torch.softmax(scores, dim=-1)
        return torch.matmul(attention, V)
    
    def forward(self, x):
        B, T, _ = x.shape
        Q = self.W_q(x).view(B, T, self.num_heads, self.d_k).transpose(1, 2)
        K = self.W_k(x).view(B, T, self.num_heads, self.d_k).transpose(1, 2)
        V = self.W_v(x).view(B, T, self.num_heads, self.d_k).transpose(1, 2)
        
        out = self.scaled_dot_product_attention(Q, K, V)
        out = out.transpose(1, 2).contiguous().view(B, T, self.d_model)
        return self.W_o(out)`;

const metricsCode = `from sklearn.metrics import (
    accuracy_score, precision_recall_fscore_support,
    roc_auc_score, confusion_matrix
)
import matplotlib.pyplot as plt
import seaborn as sns

def evaluate_classifier(y_true, y_pred, y_prob=None):
    """Comprehensive classification evaluation"""
    acc = accuracy_score(y_true, y_pred)
    prec, rec, f1, _ = precision_recall_fscore_support(
        y_true, y_pred, average='weighted'
    )
    
    metrics = {
        'Accuracy': acc,
        'Precision': prec,
        'Recall (Sensitivity)': rec,
        'F1-Score': f1,
    }
    
    if y_prob is not None:
        metrics['AUC-ROC'] = roc_auc_score(y_true, y_prob)
    
    for name, value in metrics.items():
        print(f"{name:25s}: {value:.4f}")
    
    return metrics`;

export default function FundamentalsPage() {
  return (
    <PageLayout tocItems={tocItems}>
      {/* Page Hero */}
      <div className="mb-10">
        <p className="section-label mb-2">Section 1</p>
        <h1 className="text-4xl font-black text-[#F0F0FF] mb-3">
          ML <span className="gradient-text">Fundamentals</span>
        </h1>
        <p className="text-[#A0A0C0] text-base leading-relaxed max-w-2xl">
          Comprehensive learning path from zero to production — core algorithms, deep learning, transformers, and evaluation metrics.
        </p>
      </div>

      {/* ML Basics */}
      <section id="ml-basics" className="mb-12">
        <SectionHeader
          label="1.1"
          title="Machine Learning Basics"
          description="The three paradigms of ML — how and when to use each."
          id="ml-basics"
        />

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { type: 'Supervised', icon: '🎯', desc: 'Learn from labeled data. Output is a prediction.', examples: ['Classification', 'Regression', 'Ranking'], color: 'border-blue-700/30 bg-blue-900/10' },
            { type: 'Unsupervised', icon: '🔍', desc: 'Find patterns in unlabeled data.', examples: ['Clustering', 'Dimensionality Reduction', 'Anomaly Detection'], color: 'border-green-700/30 bg-green-900/10' },
            { type: 'Reinforcement', icon: '🎮', desc: 'Learn through reward/penalty signals.', examples: ['Game Playing', 'Robotics', 'RLHF for LLMs'], color: 'border-purple-700/30 bg-purple-900/10' },
          ].map((paradigm) => (
            <div key={paradigm.type} className={`card-base p-5 border ${paradigm.color}`}>
              <div className="text-2xl mb-2">{paradigm.icon}</div>
              <h4 className="font-bold text-[#F0F0FF] mb-1.5">{paradigm.type} Learning</h4>
              <p className="text-xs text-[#A0A0C0] mb-3">{paradigm.desc}</p>
              <ul className="space-y-1">
                {paradigm.examples.map((ex) => (
                  <li key={ex} className="text-xs text-[#606080] flex items-center gap-1.5">
                    <span className="text-purple-400">▸</span>{ex}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Callout type="tip" title="Key Concept: Bias-Variance Tradeoff">
          High bias = underfitting (model too simple). High variance = overfitting (model too complex). 
          The goal is to find the sweet spot using cross-validation and regularization.
        </Callout>
      </section>

      {/* Core Algorithms */}
      <section id="algorithms" className="mb-12">
        <SectionHeader
          label="1.2"
          title="Core Algorithms"
          description="Deep dives into the most important ML algorithms with theory, implementation, and real-world use cases."
        />

        {/* Linear Regression */}
        <div id="linear-regression">
          <AlgorithmCard
            title="Linear Regression"
            emoji="📈"
            category="regression"
            overview="Finds the best-fit linear relationship between features and a continuous target variable using the least squares method. The foundation of all regression analysis."
            bestFor={['Continuous output prediction', 'When relationships are linear', 'Feature importance (coefficients)', 'DoD budget trend forecasting']}
            avoidWhen={['Non-linear relationships', 'Categorical outputs needed', 'High multicollinearity', 'Complex feature interactions']}
            tip="Always check residual plots and look for heteroscedasticity. In federal finance, log-transforming budget figures often improves linearity."
            complexity={{ time: 'O(n·p²)', space: 'O(p²)' }}
            code={linearRegressionCode}
          />
        </div>

        {/* Random Forest */}
        <div id="random-forest">
          <AlgorithmCard
            title="Random Forest"
            emoji="🌲"
            category="classification"
            overview="An ensemble of decision trees where each tree is trained on a random subset of features and data. Combines bagging with feature randomization for robust, high-performance predictions."
            bestFor={['Tabular data', 'Feature importance analysis', 'Handles missing data', 'DoD audit risk classification']}
            avoidWhen={['Large-scale real-time inference', 'When model interpretability is critical', 'Very high-dimensional sparse data']}
            tip="Feature importance from Random Forest is invaluable for DoD audit reports — it tells you exactly which factors drive financial risk."
            complexity={{ time: 'O(n·p·log n)', space: 'O(trees·depth)' }}
            code={randomForestCode}
          />
        </div>

        {/* SVM placeholder */}
        <div id="svm">
          <AlgorithmCard
            title="Support Vector Machine (SVM)"
            emoji="✂️"
            category="classification"
            overview="Finds the optimal hyperplane that maximally separates classes. Uses the kernel trick to handle non-linear decision boundaries by projecting to higher-dimensional spaces."
            bestFor={['High-dimensional text data', 'Small-to-medium datasets', 'Clear margin separation needed', 'Binary classification']}
            avoidWhen={['Large datasets (slow training)', 'Probabilistic outputs needed', 'Many features & samples']}
            tip="SVMs with RBF kernel shine on document classification — great for policy analysis (OMB Circulars, NDAA documents)."
            complexity={{ time: 'O(n²) to O(n³)', space: 'O(n)' }}
          />
        </div>

        <Callout type="info" title="Algorithm Quick Reference">
          <strong>Tabular data:</strong> XGBoost → Random Forest → Linear/Logistic Regression<br />
          <strong>Text/NLP:</strong> Transformer-based LLMs → Fine-tuned BERT → TF-IDF + SVM<br />
          <strong>Images:</strong> CNN (ResNet/EfficientNet) → Transfer Learning<br />
          <strong>Time series:</strong> LSTM → XGBoost with lag features → ARIMA
        </Callout>
      </section>

      {/* Deep Learning */}
      <section id="deep-learning" className="mb-12">
        <SectionHeader
          label="1.3"
          title="Deep Learning Essentials"
          description="From perceptrons to modern transformer architectures."
        />

        {/* Transformers */}
        <div id="transformers" className="card-base p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">⚡</span>
            <div>
              <h3 className="font-bold text-[#F0F0FF] text-lg">Transformers Architecture</h3>
              <p className="text-xs text-purple-400 font-mono">The backbone of all modern LLMs</p>
            </div>
          </div>

          <p className="text-sm text-[#A0A0C0] mb-5 leading-relaxed">
            Introduced in "Attention Is All You Need" (2017), transformers replaced RNNs with multi-head self-attention, 
            enabling parallel processing and long-range dependency capture. Every modern LLM (GPT, Claude, Gemini, Llama) 
            is built on this architecture.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-5">
            {[
              { label: 'Self-Attention', desc: 'Each token attends to every other token. Captures context across the full sequence.' },
              { label: 'Multi-Head', desc: '8-16 attention heads run in parallel, each learning different relationship patterns.' },
              { label: 'Positional Encoding', desc: 'Adds sequence order information since attention is position-agnostic.' },
              { label: 'Feed-Forward', desc: 'Position-wise MLP layers add non-linearity after each attention block.' },
            ].map((c) => (
              <div key={c.label} className="p-3 bg-[#0A0A0F] rounded-lg border border-purple-900/20">
                <p className="text-xs font-semibold text-purple-400 mb-1">{c.label}</p>
                <p className="text-xs text-[#606080]">{c.desc}</p>
              </div>
            ))}
          </div>

          <CodeBlock code={transformerCode} language="python" filename="transformer.py" />
        </div>
      </section>

      {/* Model Evaluation */}
      <section id="evaluation" className="mb-12">
        <SectionHeader
          label="1.4"
          title="Model Evaluation Metrics"
          description="Choosing the right metric is as important as choosing the right model."
        />

        <div className="overflow-x-auto rounded-xl border border-purple-900/30 mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-900/30 bg-purple-900/10">
                <th className="text-left px-4 py-3 text-xs text-purple-400 font-mono uppercase tracking-wider">Metric</th>
                <th className="text-left px-4 py-3 text-xs text-purple-400 font-mono uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs text-purple-400 font-mono uppercase tracking-wider">Formula</th>
                <th className="text-left px-4 py-3 text-xs text-purple-400 font-mono uppercase tracking-wider">Use When</th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: 'Accuracy', type: 'Classification', formula: 'TP+TN / Total', use: 'Balanced classes' },
                { metric: 'Precision', type: 'Classification', formula: 'TP / (TP+FP)', use: 'False positives costly' },
                { metric: 'Recall', type: 'Classification', formula: 'TP / (TP+FN)', use: 'False negatives costly' },
                { metric: 'F1-Score', type: 'Classification', formula: '2·P·R / (P+R)', use: 'Imbalanced classes' },
                { metric: 'AUC-ROC', type: 'Classification', formula: 'Area under ROC curve', use: 'Ranking models' },
                { metric: 'RMSE', type: 'Regression', formula: '√(Σ(y-ŷ)²/n)', use: 'Penalize large errors' },
                { metric: 'MAE', type: 'Regression', formula: 'Σ|y-ŷ|/n', use: 'Robust to outliers' },
                { metric: 'R²', type: 'Regression', formula: '1 - SS_res/SS_tot', use: 'Variance explained' },
              ].map((row) => (
                <tr key={row.metric} className="border-b border-[#1A1A35] hover:bg-purple-900/5">
                  <td className="px-4 py-3 font-semibold text-[#F0F0FF] text-sm">{row.metric}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-[9px] ${row.type === 'Classification' ? 'bg-blue-900/30 text-blue-400' : 'bg-green-900/30 text-green-400'}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gold-400">{row.formula}</td>
                  <td className="px-4 py-3 text-xs text-[#A0A0C0]">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CodeBlock code={metricsCode} language="python" filename="evaluation.py" />

        <Callout type="warning" title="DoD Context">
          In audit risk prediction, use <strong>Recall</strong> as primary metric — missing a true audit risk 
          (false negative) is far more costly than a false alarm. Target &gt;0.90 recall with acceptable precision.
        </Callout>
      </section>
    </PageLayout>
  );
}
