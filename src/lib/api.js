const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchData = async (endpoint) => {
    try{
        const response = await fetch(`${API_URL}/${path}`);
        if (!response.ok) throw new Error("Not Found")
        return await response.json();
    } catch (error){
        console.error("Fetch error:", error);
        return [];
    }
};