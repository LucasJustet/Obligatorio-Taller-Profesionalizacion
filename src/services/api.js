export class ApiService {
    static async obtenerClima(ciudad) {
        const coordenadas = {
            montevideo: { lat: -34.9011, lon: -56.1645, nombre: 'Montevideo' },
            'buenos-aires': { lat: -34.6037, lon: -58.3816, nombre: 'Buenos Aires' },
            santiago: { lat: -33.4489, lon: -70.6693, nombre: 'Santiago' }
        };

        const ubicacion = coordenadas[ciudad] || coordenadas['montevideo'];

        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${ubicacion.lat}&longitude=${ubicacion.lon}&current=temperature_2m,apparent_temperature,wind_speed_10m`;
            const respuesta = await fetch(url);
            
            if (!respuesta.ok) throw new Error('Error al obtener el clima');
            
            const datos = await respuesta.json();
            return {
                nombre: ubicacion.nombre,
                temp: datos.current.temperature_2m,
                sensacion: datos.current.apparent_temperature,
                viento: datos.current.wind_speed_10m
            };
        } catch (error) {
            console.error('Error al consultar clima:', error);
            return null;
        }
    }
    }