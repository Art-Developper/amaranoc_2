const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchData = async (path, method = "GET", body = null) => {
    console.log("Full Request URL:", `${API_URL}/${path}`)
    try {
        const options = {
            method: method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${API_URL}/${path}`, options);

        if (!response.ok) {
            if (response.status === 401) console.warn("Մուտքը մերժված է (401)");
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};