# Web-Based PDF Frequency Analysis

While standard PDF viewers facilitate keyword retrieval, they often lack aggregate analytical capabilities. This web application provides quantitative insights regarding token distribution within PDF documents.

**Key Features:**
* **Longitudinal Analysis:** Visualization of word frequency across pages for selected tokens.
* **Frequency Metrics:** Identification of the most frequently occurring tokens.
* **Length Metrics:** Extraction of the longest tokens.
* **Client-Side Processing:** All PDF operations are executed in the frontend, requiring negligible backend resources.

**Demo:** [ignaz.dev](https://frequency-analysis.ignaz.dev/)

**Case Study:**
The PostgreSQL manual (Version 18), comprising over 3,000 pages, is available [here](https://www.postgresql.org/files/documentation/pdf/18/postgresql-18-A4.pdf). The analysis below illustrates the distribution of the tokens `view` and `materialized` within this document:

<img width="2071" height="736" alt="distribution graph" src="https://github.com/user-attachments/assets/76d05bc5-5a91-482e-9341-5138b7965494" />

# Deployment

## Docker
Multi-architecture images (amd64, arm) are available via Docker Hub:
`brunoir/pdf-freq-analysis`

## Local Development
Clone the repository and execute the development script:
`npm run dev`
