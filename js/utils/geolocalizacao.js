/**
 * ============================================================
 * GEOLOCALIZAÇÃO
 * Painel Frota
 *
 * Captura a posição GPS do dispositivo.
 *
 * Retorno:
 *
 *     latitude,longitude
 *
 * Exemplo:
 *
 *     -23.550520,-46.633308
 *
 * ============================================================
 */

export function obterLocalizacao() {

    return new Promise(
        (resolve, reject) => {

            /*
             * Navegador não suporta geolocalização
             */

            if (
                !navigator.geolocation
            ) {

                reject(
                    new Error(
                        "Este navegador não suporta geolocalização."
                    )
                );

                return;

            }


            navigator.geolocation.getCurrentPosition(

                posicao => {

                    const latitude =
                        posicao.coords.latitude;

                    const longitude =
                        posicao.coords.longitude;


                    const coordenadas =
                        `${latitude},${longitude}`;


                    console.log(
                        "GPS → LOCALIZAÇÃO:",
                        coordenadas
                    );


                    resolve(
                        coordenadas
                    );

                },


                erro => {

                    let mensagem =
                        "Não foi possível obter a localização.";

                    switch (
                        erro.code
                    ) {

                        case erro.PERMISSION_DENIED:

                            mensagem =
                                "Permissão de localização negada.";

                            break;


                        case erro.POSITION_UNAVAILABLE:

                            mensagem =
                                "Localização indisponível.";

                            break;


                        case erro.TIMEOUT:

                            mensagem =
                                "Tempo esgotado ao obter a localização.";

                            break;

                    }


                    console.error(
                        "GPS → ERRO:",
                        mensagem
                    );


                    reject(
                        new Error(
                            mensagem
                        )
                    );

                },


                {

                    enableHighAccuracy:
                        true,

                    timeout:
                        15000,

                    maximumAge:
                        0

                }

            );

        }
    );

}
