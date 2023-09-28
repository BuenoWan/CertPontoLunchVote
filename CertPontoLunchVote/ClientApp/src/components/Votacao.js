import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService';

export class Votacao extends Component {
    static displayName = Votacao.name;

    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            selectedRestaurant: '',
            newRestaurant: '',
            restaurants: [],
            newRestaurantAdded: false,
            isVotingEnabled: this.isVotingEnabled()
        };
    }

    componentDidMount() {
        this.checkAuthentication();
        this.fetchRestaurants();

        // Atualiza o estado isVotingEnabled a cada minuto
        this.updateVotingStatusInterval = setInterval(() => {
            this.setState({
                isVotingEnabled: this.isVotingEnabled()
            });
        }, 60000); // Atualiza a cada minuto (60000 ms)

    }

    componentWillUnmount() {
        // Limpa o intervalo quando o componente for desmontado
        clearInterval(this.updateVotingStatusInterval);
    }

    isVotingEnabled() {
        const currentTime = new Date();
        const startTime = new Date(currentTime);
        const endTime = new Date(currentTime);

        startTime.setHours(8, 0, 0, 0); // 8:00 AM
        endTime.setHours(11, 49, 59, 999); // 11:49:59.999 AM

        return currentTime >= startTime && currentTime <= endTime;
    }

    async fetchRestaurants() {
        try {
            const response = await fetch('https://localhost:7284/api/restaurants');
            if (response.ok) {
                const data = await response.json();
                this.setState({ restaurants: data });
            } else {
                // Lógica para tratar erros ao buscar restaurantes
                console.error('Erro ao buscar restaurantes:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar restaurantes:', error);
        }
    }

    checkAuthentication = async () => {
        const isAuthenticated = await authService.isAuthenticated();
        this.setState({ isAuthenticated });
    }

    handleRestaurantChange = (event) => {
        this.setState({ selectedRestaurant: event.target.value });
    }

    handleNewRestaurantChange = (event) => {
        this.setState({ newRestaurant: event.target.value });
    }

    handleNewRestaurantSubmit = () => {
        if (this.state.isAuthenticated) {
            const { newRestaurant, restaurants } = this.state;

            // Verificar se o nome do novo restaurante já existe na lista de restaurantes
            if (restaurants.some(restaurant => restaurant.name === newRestaurant)) {
                alert("Esse nome de restaurante possui cadastro existente.");
            } else {
                // Se o nome for único, envia a solicitação POST
                fetch('https://localhost:7284/api/restaurants', {
                    method: 'POST',
                    body: JSON.stringify({ name: newRestaurant }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then((response) => {
                    // Mensagem para confirmação de cadastro de restaurante
                    alert("Restaurante cadastrado com sucesso!");
                    // Atualizar a lista de restaurantes na caixa de seleção
                    this.setState({
                        newRestaurantAdded: true,
                        restaurants: [...restaurants, { name: newRestaurant }],
                        newRestaurant: '',
                    });
                });
            }
        } else {
            alert("Você precisa fazer login para cadastrar um novo restaurante.");
        }
    };

    handleVoteSubmit = async () => {
        if (this.state.isAuthenticated) {
            const { selectedRestaurant } = this.state;

            if (selectedRestaurant) {
                try {
                    // Obter o token JWT
                    const token = await authService.getAccessToken();

                    // Enviar o voto para a API com o token JWT
                    const response = await fetch('https://localhost:7284/api/votes', {
                        method: 'POST',
                        body: JSON.stringify({ restaurantName: selectedRestaurant }),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` // Inclusão do token JWT no cabeçalho
                        },
                    });

                    if (response.ok) {
                        // Mensagem de confirmação de voto
                        alert("Voto efetuado com sucesso!");
                        // Após o voto bem-sucedido, atualizar a lista de restaurantes chamando this.fetchRestaurants();
                        this.fetchRestaurants();
                        this.setState({ selectedRestaurant: '' });
                    } else if (response.status === 409) { // Conflito
                        // Lógica para lidar com o caso de conflito (usuário já votou)
                        alert("Apenas um voto por dia.");
                    } else {
                        // Lógica para lidar com outros erros na resposta da API
                        alert("Erro ao votar no restaurante.");
                    }
                } catch (error) {
                    // Lógica para lidar com erros na obtenção do token
                    alert("Erro ao obter o token JWT.");
                }
            } else {
                alert("Selecione um restaurante antes de votar.");
            }
        } else {
            alert("Preciso fazer login para votar.");
        }
    };

    render() {
        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0');
        const month = (today.getMonth() + 1).toString();
        const formattedMonth = month.length === 1 ? `0${month}` : month;
        const formattedDate = `${day}/${formattedMonth}/${today.getFullYear()}`;

        // Atualizar a lista de restaurantes na caixa de seleção se o estado newRestaurantAdded for true:
        const restaurants = this.state.newRestaurantAdded ? [...this.state.restaurants, { name: this.state.newRestaurant }] : this.state.restaurants;

        return (
            <div>
                <h1>Bem-vindo ao sistema de votos!</h1>
                <h2>Voto do dia: {formattedDate}</h2>

                <div>
                    <h3>Restaurantes Existentes:</h3>
                    <select onChange={this.handleRestaurantChange} value={this.state.selectedRestaurant}>
                        <option value="">Selecione um restaurante</option>
                        {restaurants.map((restaurant) => (
                            <option key={restaurant.id} value={restaurant.name}>
                                {restaurant.name}
                            </option>
                        ))}
                    </select>
                    <button className="btn btn-success" onClick={this.handleVoteSubmit} disabled={!this.state.isVotingEnabled}>
                        Votar
                    </button>
                </div>
                <div>
                    <h4>OU</h4>
                </div>
                <div>
                    <h3>Cadastrar Novo Restaurante:</h3>
                    <input
                        type="text"
                        placeholder="Nome do restaurante"
                        value={this.state.newRestaurant}
                        onChange={this.handleNewRestaurantChange}
                    />
                    <button className="btn-primary" onClick={this.handleNewRestaurantSubmit}>Cadastrar</button>
                </div>
            </div>
        );
    }
}