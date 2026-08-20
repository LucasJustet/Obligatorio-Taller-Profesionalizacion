export class ApiService {
    static async obtenerClima(ciudad) {
        const coordenadas = {
            montevideo: { lat: -34.9011, lon: -56.1645, nombre: 'Montevideo' },
            colonia: { lat: -34.4699, lon: -57.8434, nombre: 'Colonia del Sacramento' },
            'juan-lacaze': { lat: -34.4281, lon: -57.4394, nombre: 'Juan Lacaze' },
            rosario: { lat: -34.3150, lon: -57.3400, nombre: 'Rosario' }
        };

        const ubicacion = coordenadas[ciudad] || coordenadas['montevideo'];

        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${ubicacion.lat}&longitude=${ubicacion.lon}&current=temperature_2m,apparent_temperature,wind_speed_10m,weather_code`;
            const respuesta = await fetch(url);
            
            if (!respuesta.ok) throw new Error('Error al obtener el clima');
            
            const datos = await respuesta.json();
            const codigoWMO = datos.current.weather_code;
            const obtenerCondicionClima = (codigo) => {
                const codigos = {
                    0: 'Despejado',
                    1: 'Mayormente despejado',
                    2: 'Parcialmente nublado',
                    3: 'Nublado',
                    45: 'Neblina',
                    48: 'Neblina con escarcha',
                    51: 'Llovizna ligera',
                    53: 'Llovizna moderada',
                    55: 'Llovizna densa',
                    61: 'Lluvia ligera',
                    62: 'Lluvia moderada',
                    63: 'Lluvia fuerte',
                    71: 'Nevada ligera',
                    80: 'Chubascos de lluvia',
                    95: 'Tormenta eléctrica'
                };
                return codigos[codigo] || 'Condición variable';
            };

            return {
                nombre: ubicacion.nombre,
                temp: datos.current.temperature_2m,
                sensacion: datos.current.apparent_temperature,
                viento: datos.current.wind_speed_10m,
                condicion: obtenerCondicionClima(codigoWMO)
            };
        } catch (error) {
            console.error('Error al consultar clima:', error);
            return null;
        }
    }
}