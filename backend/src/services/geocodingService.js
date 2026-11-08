const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const MIN_REQUEST_INTERVAL_MS = 1100;

let requestQueue = Promise.resolve();
let lastRequestAt = 0;

const geocodificarEndereco = (endereco) => {
    const request = requestQueue.then(async () => {
        const delay = Math.max(0, MIN_REQUEST_INTERVAL_MS - (Date.now() - lastRequestAt));
        if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
        }

        lastRequestAt = Date.now();
        const params = new URLSearchParams({
            q: endereco,
            format: 'jsonv2',
            limit: '1',
        });
        if (process.env.NOMINATIM_EMAIL) {
            params.set('email', process.env.NOMINATIM_EMAIL);
        }

        const response = await fetch(`${NOMINATIM_URL}?${params}`, {
            headers: { 'User-Agent': 'ProjetoJosue/1.0' },
            signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) {
            throw new Error(`Nominatim respondeu com HTTP ${response.status}`);
        }

        const [resultado] = await response.json();
        if (!resultado) {
            return null;
        }

        return {
            latitude: Number(resultado.lat),
            longitude: Number(resultado.lon),
        };
    });

    requestQueue = request.catch(() => {});
    return request;
};

module.exports = { geocodificarEndereco };