document.addEventListener("DOMContentLoaded", () => {
  const newsList = document.getElementById("news-list");

  fetch("https://agrovisiontech-1.onrender.com/") // ✅ updated from port 5000
    .then(response => response.json())
    .then(data => {
      data.forEach(article => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = article.link;
        a.target = "_blank";
        a.textContent = article.title;
        li.appendChild(a);
        newsList.appendChild(li);
      });
    })
    .catch(error => {
      console.error("Error fetching news:", error);
      newsList.innerHTML = "<li>⚠️ Failed to load news. Please try again later.</li>";
    });
});
