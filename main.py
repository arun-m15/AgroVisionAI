from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bs4 import BeautifulSoup
import requests

app = FastAPI()

# CORS middleware setup (allow any frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Add root route to avoid 404 on base URL
@app.get("/")
def root():
    return {"message": "AgroVision News Scraper Backend is Running."}

# ✅ Actual news scraping route
@app.get("/api/news")
def get_agriculture_news():
    url = 'https://www.agrifarming.in/category/agriculture-news'
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    articles = []
    for post in soup.select('.td-module-thumb'):
        link_tag = post.find_next('a')
        if link_tag:
            title = link_tag.get('title')
            link = link_tag.get('href')
            articles.append({'title': title, 'link': link})
        if len(articles) >= 10:
            break

    return articles
