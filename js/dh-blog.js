// Your Blogger JSON Feed URL with AllOrigins Proxy
const RSS_URL = `https://api.allorigins.win/get?url=${encodeURIComponent('https://www.blogger.com/feeds/648845033048129700/posts/default?alt=json')}`;

// Function to fetch and display blog posts
async function loadBlogPosts() {
  // Show the spinner before loading
  const spinner = document.querySelector(".spinner");
  spinner.style.display = "block";

  try {
    // Fetch the JSON feed via AllOrigins
    const response = await fetch(RSS_URL);
    const data = await response.json(); // Parse the proxy's response

    // Parse the JSON content from AllOrigins
    const feedData = JSON.parse(data.contents);

    // Get the posts (entries)
    const posts = feedData.feed.entry;

    // Select the HTML element to display posts
    const postsList = document.getElementById("posts-list");
    

    // Clear any existing content
    postsList.innerHTML = "";

    // Loop through posts and display them (limit to 15 posts)
    posts.slice(0, 15).forEach((post) => {
      const title = post.title.$t;
      const link = post.link.find((l) => l.rel === "alternate").href;
      const content = post.content?.$t || "";

      // Extract the first image from the content
      let tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const firstImage = tempDiv.querySelector("img")?.src || "https://via.placeholder.com/800x400";

      // Create a list item with the extracted data
      const li = document.createElement("li");
      li.innerHTML = `
        <img src="${firstImage}" alt="Blog Image" style="width:100%; height:auto;">
        <div>
          <a href="${link}" target="_blank">${title}</a>
          <p>${content.replace(/(<([^>]+)>)/gi, "").slice(0, 200)}...</p>
        </div>
      `;

      postsList.appendChild(li);
    });
  } catch (error) {
    console.error("Failed to load blog posts:", error);
    const postsList = document.getElementById("posts-list");
    postsList.innerHTML = '<li>Unable to load blog. Check your internet connection.</li>';
  } finally {
    // Hide the spinner after loading is complete
    spinner.style.display = "none";
  }
}

// Load blog posts on page load
loadBlogPosts();
setInterval(loadBlogPosts, 300000); // Reload every 5 minutes