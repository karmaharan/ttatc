        const API_URL = 'https://clean-rodent-stable.ngrok-free.app';

async function fetchBlogPosts() {
    try {
        const response = await fetch(`${API_URL}/blog`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError('Expected JSON response from server');
        }

        const data = await response.text();
        const jsonData = JSON.parse(data);
        
        const blogPostsContainer = document.getElementById('blogPosts');
        blogPostsContainer.innerHTML = '';

        if (jsonData.blog_content && jsonData.blog_content.length > 0) {
            jsonData.blog_content.forEach((post, index) => {
                const postElement = document.createElement('div');
                postElement.className = 'bg-white p-4 rounded shadow';
                postElement.innerHTML = `
                    <h3 class="font-semibold">Post #${index + 1}</h3>
                    <p>${post}</p>
                `;
                blogPostsContainer.appendChild(postElement);
            });
        } else {
            blogPostsContainer.innerHTML = '<p>No blog posts found.</p>';
        }
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        document.getElementById('blogPosts').innerHTML = '<p class="text-red-500">Error loading blog posts. Please try again later.</p>';
    }
}

     // Fetch blog posts when the page loads
        fetchBlogPosts();
