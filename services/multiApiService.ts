// services/multiApiService.ts

class MultiApiService {
    private cache: Map<string, any> = new Map();
    private apiEndpoints: string[] = [
        // Define the 9 Tidal API endpoints here
        'api/Tidal/Endpoint1',
        'api/Tidal/Endpoint2',
        'api/Tidal/Endpoint3',
        'api/Tidal/Endpoint4',
        'api/Tidal/Endpoint5',
        'api/Tidal/Endpoint6',
        'api/Tidal/Endpoint7',
        'api/Tidal/Endpoint8',
        'api/Tidal/Endpoint9',
    ];

    constructor() {}

    async callApi(endpoint: string): Promise<any> {
        // Check cache first
        if (this.cache.has(endpoint)) {
            return this.cache.get(endpoint);
        }

        try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            this.cache.set(endpoint, data);  // Cache the successful response
            return data;
        } catch (error) {
            console.error('API call failed, attempting failover...', error);
            // Implementing auto-failover logic
            return this.handleFailover(endpoint);
        }
    }

    private async handleFailover(endpoint: string): Promise<any> {
        for (const apiEndpoint of this.apiEndpoints) {
            if (apiEndpoint !== endpoint) {
                try {
                    const response = await fetch(apiEndpoint);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const data = await response.json();
                    this.cache.set(apiEndpoint, data);
                    return data;
                } catch (error) {
                    console.error(`Failover to ${apiEndpoint} failed.`, error);
                }
            }
        }
        throw new Error('All API calls failed');
    }
}

export default new MultiApiService();
