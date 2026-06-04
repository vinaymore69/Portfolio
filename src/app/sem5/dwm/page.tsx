"use client";

import { useState } from "react";
import styles from "./page.module.scss";

const PREREQS = [
  { subject: "Probability & Bayes Theorem", why: "Core math for Naive Bayes classification", forUnit: "Unit 3 – Classification", level: "critical" },
  { subject: "Euclidean Distance  √((x₁−x₂)²+(y₁−y₂)²)", why: "Used in every clustering numerical", forUnit: "Unit 4 – Clustering", level: "critical" },
  { subject: "SQL & RDBMS (tables, keys, joins, normalization)", why: "Foundation for understanding data warehouse design", forUnit: "Unit 1 – Data Warehousing", level: "critical" },
  { subject: "Set Theory (subsets, cardinality, counting)", why: "Support/confidence counting in association rules", forUnit: "Unit 5 – Association Rules", level: "critical" },
  { subject: "Information Entropy  H = −Σ p·log₂(p)", why: "ID3 decision tree splits use this formula", forUnit: "Unit 3 – Decision Tree", level: "critical" },
  { subject: "Graph Theory (nodes, directed edges, in/out-links)", why: "PageRank operates on directed web graph", forUnit: "Unit 6 – Web Mining", level: "high" },
  { subject: "Basic Statistics (mean, median, mode, quartiles)", why: "Data description & preprocessing numericals", forUnit: "Unit 2 – Preprocessing", level: "high" },
  { subject: "Logarithm base-2 values (log₂2=1, log₂4=2, log₂8=3)", why: "Entropy calculations in ID3", forUnit: "Unit 3 – Decision Tree", level: "high" },
  { subject: "Matrix / Iteration basics", why: "PageRank convergence iteration", forUnit: "Unit 6 – Web Mining", level: "medium" },
  { subject: "Tree Data Structure (traversal, recursion)", why: "Decision tree & FP-tree structure", forUnit: "Unit 3, Unit 5", level: "medium" },
];

const UNITS = [
  {
    id: 0, name: "Data Warehousing Fundamentals", short: "Unit 1 — DW Fundamentals",
    hrs: "8 hrs", accent: "#1565C0", bg: "#E3F2FD", border: "#90CAF9",
    mustRevise: "OLAP Operations • Star Schema • OLTP vs OLAP • ETL Process",
    topics: [
      {
        name: "OLAP Operations (Slice / Dice / Roll-up / Drill-down / Pivot)",
        freq: 5, types: ["Theory","Diagram"], marks: 10, must: true,
        years: "2022 Dec · 2022 May · 2023 Dec · 2025 May · 2023 May",
        how: "Design a 3D data cube for given scenario (e.g. Course-Student-Time or Product-Store-Time) and DESCRIBE ALL 5 OLAP operations applied to it.",
        tips: "Draw a labeled 3D cube. For each operation write: (1) definition (2) application on the given cube. Marks awarded per operation. Roll-up = aggregate up (city→country), Drill-down = disaggregate (year→month), Slice = fix one dimension, Dice = fix multiple → sub-cube, Pivot = rotate view.",
        trap: "Never confuse Roll-up ↔ Drill-down. Roll-up loses detail, Drill-down gains detail."
      },
      {
        name: "Star Schema / Snowflake Schema Design",
        freq: 5, types: ["Diagram"], marks: 10, must: true,
        years: "2022 Dec · 2023 May · 2023 Dec · 2024 May · 2024 Dec",
        how: "Given a business scenario (supermarket / furniture company / social media), design a Star Schema diagram. Sometimes also Snowflake. Sometimes compare both.",
        tips: "Central Fact Table (measures: units_sold, dollar_sales) → Dimension Tables (Product, Store, Time, Promotion). Snowflake = normalized dimension sub-tables. ALWAYS include a Time dimension. Label PK/FK. To compute max records: 5 yrs × 365 days × 300 stores × 4000 products/day = 2.19 billion.",
        trap: "Forgetting the Time dimension = big mark loss. Don't put measures in dimension tables."
      },
      {
        name: "OLTP vs OLAP Comparison",
        freq: 4, types: ["Theory"], marks: 5, must: true,
        years: "2022 May MCQ · 2022 Dec · 2023 May · 2023 Dec",
        how: "Compare OLTP vs OLAP systems — write as a table with 8–10 comparison points.",
        tips: "OLTP: operational, current data, CRUD, normalized, many concurrent users, simple queries, MB-GB. OLAP: analytical, historical, read-only, denormalized (star/snowflake), few analysts, complex queries, TB scale.",
        trap: "Write as a TABLE, not paragraphs. Cover at least 8 points."
      },
      {
        name: "ETL Process (Extract-Transform-Load)",
        freq: 3, types: ["Theory","Diagram"], marks: 10, must: true,
        years: "2024 May · 2025 May · 2023 Dec",
        how: "Illustrate major steps in ETL. OR Explain techniques of data loading.",
        tips: "Draw pipeline: Source Systems → EXTRACT (pull, format handling) → STAGING AREA → TRANSFORM (clean, validate, standardize, deduplicate, apply business rules) → LOAD (full/incremental/full-refresh) → DW. Loading types: Initial load vs Incremental (delta) load.",
        trap: "Don't just name ETL — explain specific TECHNIQUES within each stage."
      },
      {
        name: "Data Warehouse Architecture & Building Blocks",
        freq: 2, types: ["Theory","Diagram"], marks: 5, must: false,
        years: "2023 May · 2025 May",
        how: "What are the basic building blocks of a Data Warehouse?",
        tips: "Source Systems → ETL/Staging → Data Storage (DW + Data Marts) → OLAP Engine → Front-end (reports, mining, dashboards) + Metadata Repository throughout. Don't forget Metadata Repository.",
        trap: ""
      },
      {
        name: "Updates to Dimension Tables (SCD Types 1/2/3)",
        freq: 2, types: ["Theory"], marks: 10, must: false,
        years: "2024 Dec · 2022 May MCQ",
        how: "Explain Slowly Changing Dimension types with examples.",
        tips: "SCD Type 1: Overwrite (no history). SCD Type 2: Add new row with new surrogate key (full history). SCD Type 3: Add previous-value column (limited history). Always show a before/after table example for each.",
        trap: ""
      },
      {
        name: "Time Element in Data Warehouse",
        freq: 2, types: ["Theory"], marks: 5, must: false,
        years: "2022 Dec · 2024 Dec",
        how: "Every data structure in DW contains the time element. Why?",
        tips: "DW stores historical snapshots for trend analysis. Time dimension enables period comparisons, seasonality detection, forecasting. OLTP = current snapshot only; DW = historical record across 5–10 years.",
        trap: ""
      },
      {
        name: "Top-down vs Bottom-up DW Approach",
        freq: 1, types: ["Theory"], marks: 10, must: false,
        years: "2023 May",
        how: "Differentiate top-down and bottom-up approaches. Discuss merits and limitations.",
        tips: "Inmon (top-down): Enterprise DW first → then data marts. Long time, high cost, but consistent. Kimball (bottom-up): Start with data marts → integrate later. Faster ROI, incremental. Practical = hybrid.",
        trap: ""
      }
    ]
  },
  {
    id: 1, name: "Data Mining Introduction & Preprocessing", short: "Unit 2 — DM & Preprocessing",
    hrs: "8 hrs", accent: "#6A1B9A", bg: "#F3E5F5", border: "#CE93D8",
    mustRevise: "Data Preprocessing (steps) • KDD Process • Types of Attributes • Data Visualization",
    topics: [
      {
        name: "Data Preprocessing (Cleaning, Integration, Transformation, Reduction)",
        freq: 5, types: ["Theory"], marks: 10, must: true,
        years: "2022 May · 2023 May · 2023 Dec · 2025 May · 2024 Dec",
        how: "Explain different steps involved in data preprocessing. OR Discuss data preprocessing techniques.",
        tips: "(1) Data Cleaning: handle missing values (ignore / fill manually / use mean or median / use most probable value), noisy data (binning, regression, clustering). (2) Data Integration: merging multiple sources, handle entity identification, remove redundancy using correlation. (3) Data Transformation: normalization (min-max, z-score), aggregation, discretization. (4) Data Reduction: dimensionality reduction (PCA), numerosity reduction (sampling, histograms). Give 2–3 techniques per step.",
        trap: "Don't just list the 4 step names — explain TECHNIQUES within each. Include a binning example for noisy data."
      },
      {
        name: "KDD Process (Knowledge Discovery in Databases)",
        freq: 3, types: ["Theory","Diagram"], marks: 10, must: true,
        years: "2023 Dec · 2023 May · 2024 May",
        how: "Explain the KDD process with neat diagram. State any five applications of data mining.",
        tips: "Draw pipeline with arrows: Raw Data → Selection (target data) → Preprocessing (clean data) → Transformation (transformed data) → Data Mining (patterns) → Interpretation/Evaluation (knowledge). CRITICAL: KDD ≠ Data Mining. DM is ONE step inside KDD. Applications: market basket, fraud detection, medical diagnosis, churn prediction, web personalization.",
        trap: "The most common mistake: treating KDD and Data Mining as synonyms. Clarify explicitly in your answer."
      },
      {
        name: "Issues in Data Mining",
        freq: 3, types: ["Theory"], marks: 5, must: true,
        years: "2023 May · 2024 May · 2025 May",
        how: "Describe any five issues in data mining.",
        tips: "(1) Mining methodology — diversity of data types, noisy/incomplete data. (2) User interaction — query language, background knowledge, visualization. (3) Efficiency and scalability — algorithms must handle large datasets. (4) Diversity of data types — text, spatial, temporal, multimedia. (5) Privacy and security — ethical issues. Write 5 clearly distinct points with 2–3 lines each.",
        trap: ""
      },
      {
        name: "Data Visualization Techniques",
        freq: 4, types: ["Theory","Diagram"], marks: 10, must: true,
        years: "2023 May · 2023 Dec · 2025 May · 2024 Dec",
        how: "Explain different data visualization techniques.",
        tips: "(1) Pixel-oriented: each data value = one colored pixel. (2) Geometric projection: scatter plots, parallel coordinates, landscapes. (3) Icon-based: Chernoff faces, stick figures — attributes map to icon features. (4) Hierarchical: treemaps, cone trees, nested circles. (5) Graph-based: node-link for relationships. Draw a small sketch for at least 3 techniques.",
        trap: "Pure text answers lose marks here — always sketch at least 3 technique examples."
      },
      {
        name: "Types of Attributes",
        freq: 3, types: ["Theory"], marks: 10, must: true,
        years: "2022 Dec · 2024 Dec · 2025 May",
        how: "Discuss the different types of attributes.",
        tips: "Measurement scales: (1) Nominal — categories, no order (blood type: A/B/AB/O), mode only. (2) Ordinal — ordered categories (grade: poor/fair/good), median + mode. (3) Interval — equal intervals, no true zero (temp in °C), add/subtract OK. (4) Ratio — true zero (weight, salary), all operations valid. Also: Discrete vs Continuous, Symmetric vs Asymmetric binary.",
        trap: "Common confusion: Interval vs Ratio. Key: Ratio has a TRUE zero. Temperature in °C is Interval (0°C ≠ no temperature). Use this example in exam."
      },
      {
        name: "Data Discretization & Concept Hierarchy Generation",
        freq: 2, types: ["Theory"], marks: 10, must: false,
        years: "2024 May · 2024 Dec",
        how: "Explain data discretization and concept hierarchy generation.",
        tips: "Discretization converts continuous → discrete values. Methods: equal-width binning, equal-frequency binning, entropy-based, clustering. Concept Hierarchy: levels of abstraction. Example: city → state → country → continent. Types: schema hierarchy, set-grouping, operation-derived.",
        trap: ""
      },
      {
        name: "Handling Noisy Data — Binning Methods (Numerical)",
        freq: 1, types: ["Numerical"], marks: 10, must: false,
        years: "2024 Dec",
        how: "Given sorted data, partition into 3 bins using equi-frequency. Apply bin-mean smoothing and bin-boundary smoothing.",
        tips: "Equi-frequency: equal COUNT per bin (not equal width). Sort → divide into K equal-size groups. Bin mean: replace every value in bin with the bin's mean. Bin boundary: replace each value with the nearest boundary (min or max of the bin). Example: {3,7,8,13 | 22,22,22,26 | 26,28,30,37}.",
        trap: ""
      },
      {
        name: "Handling Missing Values",
        freq: 1, types: ["Theory"], marks: 5, must: false,
        years: "2022 Dec",
        how: "Describe various methods for handling missing attribute values.",
        tips: "(1) Ignore the tuple. (2) Fill manually. (3) Use global constant 'Unknown'. (4) Use attribute mean/median. (5) Use most probable value (Bayesian inference or decision tree). Method 5 is considered best.",
        trap: ""
      }
    ]
  },
  {
    id: 2, name: "Classification", short: "Unit 3 — Classification",
    hrs: "6 hrs", accent: "#1B5E20", bg: "#E8F5E9", border: "#A5D6A7",
    mustRevise: "Evaluating Classifier Accuracy • Naive Bayes Numerical • Decision Tree (ID3)",
    topics: [
      {
        name: "Evaluating Classifier Accuracy (Holdout, K-fold CV, Bootstrap, Confusion Matrix)",
        freq: 6, types: ["Theory"], marks: 10, must: true,
        years: "2022 Dec · 2023 May · 2023 Dec · 2024 May · 2024 Dec · 2025 May",
        how: "Explain any two / all methods for evaluating accuracy of a classifier. Describe Holdout, Random Subsampling, Cross-Validation, Bootstrap.",
        tips: "(1) Holdout: split 70/30 train/test — single estimate, simple. (2) Random Subsampling: repeat holdout K times, average. (3) K-Fold Cross-Validation: divide into K folds, train on K-1, test on 1, rotate K times. K=10 typical. Stratified = balanced classes per fold. (4) Bootstrap: sample n with replacement, ~63.2% unique in training, ~36.8% OOB for test. ALSO explain: Confusion Matrix (TP/TN/FP/FN), Accuracy=(TP+TN)/Total, Precision=TP/(TP+FP), Recall=TP/(TP+FN), F1=2PR/(P+R).",
        trap: "HIGHEST FREQUENCY topic (6/7 papers). Must prepare comprehensively. Always draw the Confusion Matrix diagram. Mention when each method is preferred."
      },
      {
        name: "Naive Bayes Classifier — Numerical Problems",
        freq: 4, types: ["Numerical","Theory"], marks: 10, must: true,
        years: "2022 Dec · 2023 Dec · 2024 Dec · 2024 May",
        how: "Given training table (Color/Type/Origin/Stolen OR Chills/Fever/Headache/Flu), classify a new tuple. Show ALL probability calculations.",
        tips: "STEPS: (1) P(Yes) = count_yes/N, P(No) = count_no/N. (2) For each attribute in new tuple X, compute P(attr_val | Yes) and P(attr_val | No) from training data. (3) P(X|Yes) = product of all P(attr_i | Yes). (4) P(Yes|X) ∝ P(Yes)×P(X|Yes). Compare with P(No|X). Predict higher. Laplacian correction: add 1 to numerator + count_classes to denominator when any P=0.",
        trap: "Show ALL intermediate fractions in a table. Forgetting Laplacian correction when a count = 0 = common error. Don't skip steps."
      },
      {
        name: "Decision Tree Induction — ID3 Algorithm",
        freq: 3, types: ["Theory","Numerical"], marks: 10, must: true,
        years: "2023 May · 2024 May · 2025 May",
        how: "Explain Decision Tree classification with example. OR Use ID3 to build tree for given dataset and predict a new instance.",
        tips: "ID3 STEPS: (1) E(S) = −p_yes·log₂(p_yes) − p_no·log₂(p_no). (2) For each attribute A: E(A) = Σ |Sᵥ|/|S| × E(Sᵥ). (3) Gain(A) = E(S) − E(A). (4) Pick attribute with MAXIMUM gain as node. (5) Recurse. Key log₂ values: log₂(2)=1, log₂(4)=2, log₂(8)=3. For others: log₂(x) = ln(x)/ln(2) ≈ log(x)/0.301. Pure leaf (all same class) → Entropy=0.",
        trap: "Show full entropy calculation for EACH attribute before comparing gains. Draw the final tree clearly with leaf class labels."
      },
      {
        name: "Supervised vs Unsupervised Learning",
        freq: 1, types: ["Theory"], marks: 5, must: false,
        years: "2025 May",
        how: "Differentiate supervised and unsupervised learning.",
        tips: "Supervised: labeled training data, learns input→output mapping. Tasks: Classification, Regression. Algorithms: DT, Naive Bayes, SVM, KNN. Unsupervised: no labels, finds structure. Tasks: Clustering, Association. Algorithms: K-Means, Apriori, K-Medoids.",
        trap: ""
      },
      {
        name: "Classification vs Clustering",
        freq: 1, types: ["Theory"], marks: 5, must: false,
        years: "2024 Dec",
        how: "Differentiate between Classification and Clustering.",
        tips: "Classification: predefined classes, supervised, uses labeled training set. Clustering: no predefined classes, unsupervised, discovers natural groupings. Write 5-point table covering: labels, supervision, output, examples of algorithms, use cases.",
        trap: ""
      }
    ]
  },
  {
    id: 3, name: "Clustering", short: "Unit 4 — Clustering",
    hrs: "6 hrs", accent: "#B71C1C", bg: "#FFEBEE", border: "#EF9A9A",
    mustRevise: "K-Means Numerical (practice 5+ problems) • Single-Link Clustering + Dendrogram • K-Medoids theory",
    topics: [
      {
        name: "K-Means Algorithm — Numerical (APPEARS EVERY YEAR)",
        freq: 7, types: ["Numerical","Theory"], marks: 10, must: true,
        years: "2022 May · 2022 Dec · 2023 May · 2023 Dec · 2024 May · 2024 Dec · 2025 May",
        how: "Given N data points (2D or 1D), apply K-means with K=2 or K=3. Show: (a) cluster centers after 1st iteration, (b) final clusters. Also asked: draw flowchart.",
        tips: "ALGORITHM: (1) Initialize K centroids (usually the first K points or given). (2) Assign each point to nearest centroid using Euclidean distance d=√((x₁−x₂)²+(y₁−y₂)²). (3) Recalculate each centroid = mean of all assigned points. (4) Repeat until no point changes cluster. FORMAT: Show a table for each iteration: Point | Dist to C1 | Dist to C2 | Dist to C3 | Assigned Cluster. Then show new centroid. FLOWCHART: Start → Init K → Assign each point to nearest centroid → Recalculate centroids → Any change? → No → Stop / Yes → Loop back.",
        trap: "Always show distance calculations explicitly. Round centroids to 2 decimals. For 1D: distance = |x₁−x₂|. Convergence = no reassignment in an iteration."
      },
      {
        name: "Single-Link Agglomerative Clustering + Dendrogram",
        freq: 4, types: ["Numerical","Diagram"], marks: 10, must: true,
        years: "2022 Dec · 2023 Dec · 2024 May · 2022 May",
        how: "Given N data points (X,Y coordinates or distance matrix), apply agglomerative clustering with single-link (min distance). Draw the dendrogram.",
        tips: "STEPS: (1) Compute ALL pairwise Euclidean distances → N×N matrix. (2) Find the minimum distance pair → merge into one cluster. (3) Update matrix: single-link distance to new cluster = MIN of the two distances. (4) Repeat till 1 cluster. DENDROGRAM: x-axis = data points, y-axis = distance at which clusters merge. Draw horizontal lines at merge heights. STANDARD DATASET (appears 3 times): P1(0.40,0.53), P2(0.22,0.38), P3(0.35,0.32), P4(0.26,0.19), P5(0.08,0.41), P6(0.45,0.30). Pre-calculate and memorize this dataset.",
        trap: "Show the FULL initial distance matrix. After each merge, update the row/column correctly for single-link. Scale the dendrogram y-axis properly."
      },
      {
        name: "K-Medoids Algorithm",
        freq: 3, types: ["Theory"], marks: 5, must: true,
        years: "2022 Dec · 2024 Dec · 2025 May",
        how: "Describe the K-Medoids clustering algorithm. OR Short note on K-Medoids clustering.",
        tips: "Like K-Means but uses ACTUAL data points (medoids) as cluster representatives, not computed means. Algorithm (PAM): (1) Select K data objects as initial medoids. (2) Assign all objects to nearest medoid. (3) For each medoid M and non-medoid O: compute cost if O replaces M. (4) Perform swap if total cost decreases. (5) Repeat. Advantage: robust to outliers and noise (medoid is a real point, not a phantom centroid).",
        trap: "Always distinguish: K-Means centroid may not be an actual data point. K-Medoids medoid IS always an actual data point."
      },
      {
        name: "Agglomerative vs Divisive Clustering",
        freq: 1, types: ["Theory"], marks: 5, must: false,
        years: "2023 May",
        how: "Differentiate between agglomerative and divisive clustering methods.",
        tips: "Agglomerative (bottom-up): N clusters initially (one per point) → merge closest pair at each step. Divisive (top-down): start with 1 cluster (all points) → split at each step. Both produce dendrograms. Agglomerative is more common and simpler. Divisive can be more accurate for large K.",
        trap: ""
      },
      {
        name: "Complete-Link Clustering (Numerical)",
        freq: 1, types: ["Numerical"], marks: 10, must: false,
        years: "2023 May",
        how: "Given a distance matrix, apply complete-link agglomerative clustering and draw dendrogram.",
        tips: "Complete link = MAXIMUM distance between any two points from different clusters. Tends to produce compact, roughly equal-sized spherical clusters. Opposite of single-link (which produces elongated chain clusters). Show step-by-step distance matrix updates after each merge.",
        trap: ""
      }
    ]
  },
  {
    id: 4, name: "Mining Frequent Patterns & Associations", short: "Unit 5 — Association Rules",
    hrs: "6 hrs", accent: "#E65100", bg: "#FFF3E0", border: "#FFCC80",
    mustRevise: "Apriori Algorithm (practice 5+ numerical problems) • Multilevel & Multidimensional Association Rules • FP-Growth",
    topics: [
      {
        name: "Apriori Algorithm — Numerical (APPEARS EVERY YEAR)",
        freq: 7, types: ["Numerical"], marks: 10, must: true,
        years: "2022 May · 2022 Dec · 2023 May · 2023 Dec · 2024 May · 2024 Dec · 2025 May",
        how: "Given transaction DB with min support (count or %) and min confidence (%), find ALL frequent itemsets and list strong association rules.",
        tips: "ALGORITHM: (1) Scan DB → count all 1-itemsets → prune those below min support → L1. (2) Join L1 with itself → generate C2 candidate 2-itemsets. (3) Scan DB → count C2 → prune → L2. (4) Repeat for L3, L4, etc. (5) For ASSOCIATION RULES: for each frequent k-itemset, generate all non-empty subsets s. Rule: s → (X−s). Confidence = support(X) / support(s). Keep if ≥ min confidence. KEY FORMULAS: Support(A→B) = P(A∪B) = count(A∪B)/N. Confidence(A→B) = support(A∪B)/support(A). FORMAT: Show tables — C1/L1/C2/L2 etc. Then list all strong rules with support% and confidence%.",
        trap: "Confidence denominator = support of ANTECEDENT, not total transactions. Show all intermediate Cₖ/Lₖ tables. Practice at least 5 different datasets before exam."
      },
      {
        name: "Multilevel Association Rule Mining",
        freq: 5, types: ["Theory"], marks: 10, must: true,
        years: "2023 Dec · 2023 May · 2024 May · 2024 Dec · 2025 May",
        how: "Explain multilevel association rule mining with example. OR Demonstrate multilevel and multidimensional association rules.",
        tips: "Mining rules at multiple levels of a concept hierarchy. Example hierarchy: 2% milk → milk → dairy products → food. Level 1 (specific): '2% milk → white bread'. Level 2 (general): 'dairy → bakery'. Approaches: (a) Use uniform min-support at all levels. (b) Reduce min-support as you go deeper (level-crossing). Cross-level rules span multiple hierarchy levels. Draw the concept hierarchy tree with at least 3 levels.",
        trap: "Always draw the concept hierarchy. Explain WHY same min-support for all levels doesn't work well (specific items have inherently low support)."
      },
      {
        name: "Multidimensional Association Rule Mining",
        freq: 4, types: ["Theory"], marks: 10, must: true,
        years: "2023 May · 2024 May · 2024 Dec · 2025 May",
        how: "Demonstrate multidimensional association rules with suitable examples.",
        tips: "Rules involving multiple predicates/attributes (dimensions). Example: age(X,'20−29') ∧ income(X,'high') ⟹ buys(X,'laptop') [s=3%, c=60%]. Types: (1) Inter-dimensional rules: each predicate appears once. (2) Hybrid (intra-dimensional): one predicate can repeat. Mining: quantitative attributes need discretization first (static → equal-width bins, or dynamic). Each attribute = one 'dimension' of analysis.",
        trap: "Distinguish from Multilevel: Multilevel = concept hierarchy levels of ONE attribute; Multidimensional = MULTIPLE different attributes in the rule."
      },
      {
        name: "Market Basket Analysis",
        freq: 3, types: ["Theory"], marks: 5, must: true,
        years: "2022 Dec · 2024 May · 2025 May",
        how: "Explain market basket analysis with an example.",
        tips: "Retail application: find which products are bought together. Transaction DB: rows = shopping baskets. Example rule: {diapers} → {beer} [s=2%, c=85%]. Metrics with formulas: Support(A∪B) = |transactions containing A and B|/|total transactions|. Confidence(A→B) = P(B|A) = Support(A∪B)/Support(A). Lift = Confidence(A→B)/P(B). Lift > 1 = positive association. Applications: product placement, cross-selling, recommendations.",
        trap: ""
      },
      {
        name: "FP-Growth Algorithm & FP-Tree",
        freq: 4, types: ["Theory","Numerical","Diagram"], marks: 10, must: true,
        years: "2022 Dec · 2024 Dec · 2023 Dec · 2025 May",
        how: "Find all frequent itemsets using FP-Growth. OR Explain FP-Growth algorithm. OR Short note on FP-Tree.",
        tips: "FP-TREE CONSTRUCTION: (1) Scan DB → find frequent 1-itemsets, sort by decreasing support. (2) Second scan: insert each transaction (items sorted by freq order) into prefix-tree. Share prefixes. Header table = all frequent items + link to first node in tree. FP-GROWTH MINING: For each item (leaf → root): find conditional pattern base → build conditional FP-tree → extract patterns. KEY ADVANTAGE over Apriori: no candidate generation. Only 2 DB scans. Draw the tree step-by-step for each transaction.",
        trap: "The header table and node-links are essential. Sort items in each transaction by GLOBAL frequency order before inserting into tree."
      }
    ]
  },
  {
    id: 5, name: "Web Mining", short: "Unit 6 — Web Mining",
    hrs: "5 hrs", accent: "#004D40", bg: "#E0F2F1", border: "#80CBC4",
    mustRevise: "Page Rank (with numerical example) • Web Usage Mining • All 3 Types of Web Mining",
    topics: [
      {
        name: "Page Rank Algorithm — Theory + Numerical Calculation",
        freq: 7, types: ["Theory","Numerical"], marks: 10, must: true,
        years: "2022 May · 2022 Dec · 2023 May · 2023 Dec · 2024 May · 2024 Dec · 2025 May",
        how: "Explain Page Rank algorithm with example. Show calculations. Describe page ranking technique.",
        tips: "FORMULA: PR(A) = (1−d) + d × Σᵢ [PR(Tᵢ) / C(Tᵢ)] where d = damping factor (0.85), Tᵢ = pages linking TO A, C(Tᵢ) = out-link count of Tᵢ. EXAMPLE SETUP: Draw a 3–4 page directed graph with hyperlinks. Initial PR = 1/N for all pages. Iterate the formula 2–3 times showing convergence. Higher PR = more authoritative. Random Surfer Model: d = probability user follows a link (vs teleporting to random page). Google's foundation.",
        trap: "Must show a GRAPH diagram + at least 2 iterations of numerical PR calculation for full marks. Theory-only answers get partial marks."
      },
      {
        name: "Web Structure Mining",
        freq: 4, types: ["Theory"], marks: 10, must: true,
        years: "2022 May · 2022 Dec · 2023 May · 2025 May",
        how: "What is web structure mining? Describe page ranking technique and approaches to improve search engines.",
        tips: "Mining the web's hyperlink structure. Key algorithms: (1) PageRank (Google): importance based on in-links weighted by linking page's rank. (2) HITS/CLEVER (Kleinberg): Hubs (pages with many out-links to authorities) and Authorities (pages with many in-links from hubs). Hubs and authorities mutually reinforce each other. Draw hub-authority diagram. Applications: search engine ranking, community detection.",
        trap: "Explain BOTH PageRank and HITS algorithms. Many students only write PageRank. Mention the hub-authority duality with a sketch."
      },
      {
        name: "Web Usage Mining",
        freq: 4, types: ["Theory"], marks: 5, must: true,
        years: "2023 Dec · 2024 May · 2025 May · 2023 May",
        how: "Write short note on web usage mining. State any two applications.",
        tips: "Mining web server access logs to discover user navigation patterns. Phases: (1) PREPROCESSING: data cleaning (remove image/CSS requests), user identification (IP + user-agent), session identification (30-min timeout heuristic), path completion. (2) PATTERN DISCOVERY: association rules (pages often visited together), sequential patterns (navigation sequences), clustering (user segments), classification. Applications: personalization, site redesign/optimization, targeted advertising, e-commerce recommendations.",
        trap: "Always name 2 specific applications. Mention user identification and session identification in preprocessing — examiners specifically look for these."
      },
      {
        name: "Types of Web Mining & Web Mining vs Data Mining",
        freq: 2, types: ["Theory"], marks: 10, must: true,
        years: "2022 Dec · 2024 Dec",
        how: "Is web mining different from classical data mining? Describe the three types of web mining.",
        tips: "Web mining IS a specialized form of data mining on web data. Differences: data is unstructured/semi-structured (HTML vs structured tables), distributed, dynamic, multilingual, heterogeneous. THREE TYPES: (A) Web Content Mining: extract useful info from page text/images/video. Uses: NLP, IR, classification, clustering. (B) Web Structure Mining: analyze hyperlinks (PageRank, HITS). (C) Web Usage Mining: analyze server logs/clickstreams. Draw a 3-column comparison table.",
        trap: "Explain WHY web data is challenging (semi-structured, distributed, dynamic) — not just that it's different. Give the table."
      },
      {
        name: "Web Content Mining",
        freq: 2, types: ["Theory"], marks: 5, must: false,
        years: "2023 Dec · 2025 May",
        how: "Write short note on web content mining.",
        tips: "Mining useful information from web page content (text, images, audio, video, hyperlinks, metadata). Data collection: web crawlers, harvest systems. Techniques: NLP for text, information retrieval, classification, clustering. Challenges: unstructured nature, multiple languages, dynamic content. Personalization: tailoring content to user profiles.",
        trap: ""
      }
    ]
  }
];

type Topic = {
  name: string;
  freq: number;
  types: string[];
  marks: number;
  must?: boolean;
  years?: string;
  how?: string;
  tips?: string;
  trap?: string;
};

type TopicType = "Theory" | "Numerical" | "Diagram";

function FreqBar({ freq }: { freq: number }) {
  const colors = ["#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0","#e2e8f0"];
  const filled = ["#ef4444","#ef4444","#f97316","#f97316","#f59e0b","#22c55e","#94a3b8"];
  const dotColor = freq >= 6 ? "#ef4444" : freq >= 4 ? "#f97316" : freq >= 2 ? "#f59e0b" : "#94a3b8";
  return (
    <div style={{display:"flex",gap:3,alignItems:"center"}}>
      {[1,2,3,4,5,6,7].map(i => (
        <div key={i} style={{width:9,height:9,borderRadius:"50%",background:i<=freq?dotColor:"#e2e8f0",flexShrink:0}}/>
      ))}
      <span style={{fontSize:11,fontWeight:500,color:dotColor,marginLeft:3}}>{freq}×</span>
    </div>
  );
}

function TypeBadge({ t }: { t: string }) {
  const stylesMap: Record<TopicType, { background: string; color: string }> = {
    Theory:    { background: "#EFF6FF", color: "#1D4ED8" },
    Numerical: { background: "#FAF5FF", color: "#7C3AED" },
    Diagram:   { background: "#F0FDF4", color: "#166534" },
  };
  const s = (t === "Theory" || t === "Numerical" || t === "Diagram")
    ? stylesMap[t as TopicType]
    : { background: "#F1F5F9", color: "#475569" };
  return (
    <span style={{...s,fontSize:10,fontWeight:500,padding:"2px 7px",borderRadius:4,whiteSpace:"nowrap"}}>
      {t}
    </span>
  );
}

function TopicCard({ topic }: { topic: Topic }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,marginBottom:8,overflow:"hidden"}}>
      <div
        onClick={()=>setOpen(o=>!o)}
        style={{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 14px",cursor:"pointer",
          background:"var(--color-background-primary)"}}
      >
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:5}}>
            {topic.must && (
              <span style={{background:"#FEF2F2",color:"#B91C1C",fontSize:10,fontWeight:500,
                padding:"2px 7px",borderRadius:4,whiteSpace:"nowrap"}}>★ must know</span>
            )}
            {topic.types.map(t=><TypeBadge key={t} t={t}/>)}
            <span style={{fontSize:10,color:"var(--color-text-secondary)",marginLeft:"auto",whiteSpace:"nowrap"}}>
              {topic.marks} marks
            </span>
          </div>
          <p style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)",margin:0,lineHeight:1.4}}>
            {topic.name}
          </p>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
          <FreqBar freq={topic.freq}/>
          <span style={{fontSize:10,color:"var(--color-text-secondary)",
            transform:open?"rotate(180deg)":"none",transition:"transform 0.2s",display:"inline-block"}}>▼</span>
        </div>
      </div>

      {open && (
        <div style={{borderTop:"0.5px solid var(--color-border-tertiary)",
          background:"var(--color-background-secondary)",padding:"12px 14px"}}>
          <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:8}}>
            Asked in: {topic.years}
          </div>

          <div style={{marginBottom:10}}>
            <p style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",
              textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:4}}>how it's asked in exam</p>
            <p style={{fontSize:13,color:"var(--color-text-primary)",margin:0,lineHeight:1.6}}>{topic.how}</p>
          </div>

          <div style={{marginBottom:topic.trap?10:0}}>
            <p style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",
              textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:4}}>what to write / study tips</p>
            <p style={{fontSize:13,color:"var(--color-text-primary)",margin:0,lineHeight:1.6}}>{topic.tips}</p>
          </div>

          {topic.trap && (
            <div style={{background:"#FEF9C3",border:"0.5px solid #FDE047",borderRadius:7,padding:"8px 12px"}}>
              <p style={{fontSize:11,fontWeight:500,color:"#854D0E",marginBottom:2}}>⚠ Common pitfall</p>
              <p style={{fontSize:12,color:"#713F12",margin:0,lineHeight:1.5}}>{topic.trap}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DWMStudyGuide() {
  const [activeUnit, setActiveUnit] = useState(0);
  const [showPrereqs, setShowPrereqs] = useState(false);
  const [filter, setFilter] = useState("all");

  const FILTERS = ["all", "must", "numerical"] as const;

  const unit = UNITS[activeUnit];
  const filteredTopics = unit.topics.filter(t => {
    if (filter === "must") return t.must;
    if (filter === "numerical") return t.types.includes("Numerical");
    return true;
  });

  const freqColor = (f: number): string => (f >= 6 ? "#EF4444" : f >= 4 ? "#F97316" : f >= 2 ? "#F59E0B" : "#94A3B8");
  const levelColor = (l: string): string => (l === "critical" ? "#B91C1C" : l === "high" ? "#C2410C" : "#1D4ED8");
  const levelBg = (l: string): string => (l === "critical" ? "#FEF2F2" : l === "high" ? "#FFF7ED" : "#EFF6FF");

  const allTopics = UNITS.flatMap(u=>u.topics);
  const top5 = [...allTopics].sort((a,b)=>b.freq-a.freq).slice(0,5);

  return (
    <div style={{fontFamily:"var(--font-sans)",padding:"1rem 0",maxWidth:720}}>
      <h2 className="sr-only">DWM Complete Study Guide — 7 Year Exam Pattern Analysis</h2>

      <p style={{fontSize:18,fontWeight:500,color:"var(--color-text-primary)",margin:"0 0 4px"}}>
        DWM Complete Study Guide
      </p>
      <p style={{fontSize:12,color:"var(--color-text-secondary)",margin:"0 0 1.25rem"}}>
        Paper 31924 · TE Comp Sem V · C Scheme · Analysis of 7 exam papers (2022–2025)
      </p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8,marginBottom:"1.25rem"}}>
        {[
          {v:"7 papers",l:"analyzed (2022–2025)"},
          {v:"🔥 7×",l:"Apriori · K-Means · PageRank"},
          {v:"6×",l:"Classifier Accuracy"},
          {v:"5×",l:"OLAP Ops · Star Schema · Preprocessing"},
        ].map(s=>(
          <div key={s.l} style={{background:"var(--color-background-secondary)",padding:"10px 12px",
            borderRadius:"var(--border-radius-md)"}}>
            <div style={{fontSize:20,fontWeight:500,color:"var(--color-text-primary)",lineHeight:1.2}}>{s.v}</div>
            <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{marginBottom:"1.25rem",background:"var(--color-background-secondary)",
        borderRadius:"var(--border-radius-md)",padding:"10px 14px"}}>
        <p style={{fontSize:12,fontWeight:500,color:"var(--color-text-secondary)",
          textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:8}}>Top 5 most asked topics</p>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {top5.map((t,i)=>(
            <div key={t.name} style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:11,color:"var(--color-text-secondary)",width:16}}>{i+1}.</span>
              <div style={{flex:1,height:5,background:"var(--color-border-tertiary)",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(t.freq/7)*100}%`,background:freqColor(t.freq),borderRadius:3}}/>
              </div>
              <span style={{fontSize:11,color:"var(--color-text-primary)",flex:2,lineHeight:1.3}}>{t.name.split("(")[0].trim()}</span>
              <span style={{fontSize:11,fontWeight:500,color:freqColor(t.freq),whiteSpace:"nowrap"}}>{t.freq}/7 papers</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",
        marginBottom:"1.25rem",overflow:"hidden"}}>
        <div onClick={()=>setShowPrereqs(p=>!p)}
          style={{display:"flex",alignItems:"center",justifyContent:"space-between",
            padding:"10px 14px",cursor:"pointer",background:"var(--color-background-secondary)"}}>
          <span style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)"}}>
            Prerequisites — topics to revise before starting DWM
          </span>
          <span style={{fontSize:12,color:"var(--color-text-secondary)",
            transform:showPrereqs?"rotate(180deg)":"none",transition:"transform 0.2s",display:"inline-block"}}>▼</span>
        </div>
        {showPrereqs && (
          <div className={styles.prereqsWrap} style={{borderTop: "0.5px solid var(--color-border-tertiary)"}}>
            <div className={styles.prereqsGrid}>
              {PREREQS.map((p) => (
                <div key={p.subject} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <p className={styles.subject}>{p.subject}</p>
                    <span
                      className={styles.level}
                      style={{ background: levelBg(p.level), color: levelColor(p.level) }}
                    >
                      {p.level}
                    </span>
                  </div>
                  <p className={styles.forUnit}>{p.forUnit}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:"1rem"}}>
        {UNITS.map((u,i)=>(
          <button key={u.id} onClick={()=>{setActiveUnit(i);setFilter("all");}}
            style={{padding:"6px 11px",borderRadius:6,fontSize:12,cursor:"pointer",border:"0.5px solid",
              background:activeUnit===i?u.bg:"var(--color-background-secondary)",
              color:activeUnit===i?u.accent:"var(--color-text-secondary)",
              borderColor:activeUnit===i?u.border:"var(--color-border-tertiary)",
              fontWeight:activeUnit===i?500:400,transition:"all 0.15s",fontFamily:"inherit",whiteSpace:"nowrap"}}>
            {u.short}
          </button>
        ))}
      </div>

      <div style={{background:unit.bg,border:`0.5px solid ${unit.border}`,borderRadius:"var(--border-radius-md)",
        padding:"10px 14px",marginBottom:"1rem"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"flex-start",justifyContent:"space-between"}}>
          <div>
            <p style={{fontSize:15,fontWeight:500,color:unit.accent,margin:"0 0 4px"}}>{unit.name}</p>
            <p style={{fontSize:12,color:unit.accent,opacity:0.8,margin:0}}>{unit.hrs} syllabus · {unit.topics.length} topics</p>
          </div>
          <div style={{textAlign:"right"}}>
            <p style={{fontSize:10,fontWeight:500,color:unit.accent,opacity:0.7,margin:"0 0 3px",textTransform:"uppercase",letterSpacing:"0.4px"}}>Must-revise topics</p>
            <p style={{fontSize:11,color:unit.accent,margin:0,maxWidth:280,lineHeight:1.4}}>{unit.mustRevise}</p>
          </div>
        </div>
      </div>

      <div style={{display:"flex",gap:6,marginBottom:"1rem",flexWrap:"wrap"}}>
        {FILTERS.map((f: typeof FILTERS[number]) => (
          <button key={f} onClick={()=>setFilter(f as string)}
            style={{padding:"4px 10px",borderRadius:5,fontSize:12,cursor:"pointer",border:"0.5px solid",fontFamily:"inherit",
              background:filter===f?"var(--color-background-primary)":"var(--color-background-secondary)",
              color:filter===f?"var(--color-text-primary)":"var(--color-text-secondary)",
              borderColor:filter===f?"var(--color-border-secondary)":"var(--color-border-tertiary)",
              fontWeight:filter===f?500:400}}>
            {f==="all"?"All topics":f==="must"?"★ Must-know only":"Numericals only"}
          </button>
        ))}
        <span style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:"28px",marginLeft:4}}>
          {filteredTopics.length} topics
        </span>
      </div>

      <div>
        {filteredTopics.map(t=><TopicCard key={t.name} topic={t}/>)}
      </div>

      <div style={{marginTop:"1.5rem",padding:"12px 14px",background:"var(--color-background-secondary)",
        borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-tertiary)"}}>
        <p style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",margin:"0 0 8px"}}>
          General exam strategy
        </p>
        {[
          "Q1 = Any 4 of 6 short questions (5 marks each) — prepare all 6 units for this. Fast answers here free time for detailed answers later.",
          "Apriori + K-Means + PageRank appear EVERY year — master all three numerically first. These alone cover 30 marks worth.",
          "For all numerical questions: show every step, every calculation, every intermediate table. Don't just write the final answer.",
          "Q2–Q6 = Two sub-questions each (10 marks each). Attempt 3 full questions from 5. Don't attempt partial questions — full 20-mark questions score better.",
          "Diagram questions (Star Schema, Dendrogram, FP-Tree): spend time drawing clearly with labels. A clear diagram = full marks.",
          "Frequency badge meaning: red = 6–7 papers, orange = 4–5 papers, yellow = 2–3 papers, gray = 1 paper.",
        ].map((tip,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
            <span style={{fontSize:12,color:"var(--color-text-secondary)",flexShrink:0,lineHeight:1.6}}>{i+1}.</span>
            <p style={{fontSize:12,color:"var(--color-text-secondary)",margin:0,lineHeight:1.6}}>{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}