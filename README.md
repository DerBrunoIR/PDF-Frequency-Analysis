# Frequency Analysis

PDF Readers can search and find individual words in a PDF.
This web application provides aggregated insights about words occuring in a PDF.
Especially the following features:
- word frequency over pages for selected tokens
- most frequently used words
- longest used words
while using minimal backend resources, since all PDF operations are performed in the frontend.
[ignaz.dev](https://frequency-analysis.ignaz.dev/)

The PostgreSQL manual (version 18) contains over 3 thousand pages and can be found [here](https://www.postgresql.org/files/documentation/pdf/18/postgresql-18-A4.pdf).
And we get the following distributioni for the words `view` and `materialized`:
<img width="2071" height="736" alt="image" src="https://github.com/user-attachments/assets/76d05bc5-5a91-482e-9341-5138b7965494" />


# How to run
## Docker
docker image for amd64 and arm:
brunoir/pdf-freq-analysis 

## Locally
clone and
```
npm run dev
```


