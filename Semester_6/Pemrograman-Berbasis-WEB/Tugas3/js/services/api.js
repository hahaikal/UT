const ApiService = {
    async fetchData() {
        try {
            const response = await fetch('data/dataBahanAjar.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            // Return empty data structure in case of error
            return {
                upbjjList: [],
                kategoriList: [],
                pengirimanList: [],
                paket: [],
                stok: [],
                tracking: []
            };
        }
    }
};