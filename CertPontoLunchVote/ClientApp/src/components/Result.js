import React, { Component } from 'react';

export class MostVotedRestaurant extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mostVotedRestaurant: null,
            currentDate: new Date(), // Adicionada a data atual ao estado
        };
    }

    componentDidMount() {
        // Solicitação GET para obter o restaurante mais votado do dia
        fetch('https://localhost:7284/api/restaurants/MostVotedOfDay')
            .then((response) => {
                if (response.ok) {
                    // Contexto para tratar a resposta da API e definir o estado
                    response.json().then((data) => {
                        this.setState({
                            mostVotedRestaurant: data,
                        });
                    });
                } else {
                    // Contexto para lidar com erros na resposta da API
                    console.error('Erro na resposta da API:', response.statusText);
                }
            })
            .catch((error) => {
                // Contexto para lidar com erros de rede ou outros erros
                console.error('Erro ao fazer a solicitação:', error);
            });
    }

    render() {
        const { mostVotedRestaurant, currentDate } = this.state;

        return (
            <div>
                <h2>Restaurante Mais Votado do Dia ({currentDate.toLocaleDateString()})</h2>
                {mostVotedRestaurant ? (
                    <p>O restaurante mais votado do dia: <strong>{mostVotedRestaurant.name}</strong></p>
                ) : (
                    <p>Carregando...</p>
                )}
            </div>
        );
    }
}

export default MostVotedRestaurant;
