import React, { Component } from 'react';
export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
        };
    }

    render() {
        const formattedDate = `${this.state.date.getDate()}/${this.state.date.getMonth() + 1}/${this.state.date.getFullYear()}`;

        return (
            <div>
                <h1 className="display-4">Bem-vindo ao sistema de votação!</h1>
                <h2 className="lead">Hoje o voto se refere ao dia: {formattedDate}</h2>
                <p className="lead">
                    Este sistema permite que profissionais votem no restaurante que desejam comer no almoço.
                    <br />
                    O restaurante escolhido é divulgado às 11h50 de cada dia e não pode ser escolhido novamente na mesma semana.
                </p>
                <p className="lead">
                    Cada usuário pode votar apenas uma vez por dia.
                    <br />
                    O restaurante mais votado do dia, só estará disponível na próxima semana para ser votado novamente.
                </p>
                <p>
                    **Menu de Navegação**
                    <ul>
                        <li>
                            <strong>Votar/Cadastrar</strong> - permite que o usuário vote no restaurante que deseja comer no almoço ou cadastre um novo restaurante para que ele possa ser votado, no período das 8h:00min até as 11h:49min.
                        </li>
                        <li>
                            <strong>Resultado</strong> - permite que o usuário veja o resultado da votação do dia. A aba estará disponível todos os dias a partir das 11h:50min.
                        </li>
                    </ul>
                </p>
                <p>
                    **Login necessário**
                    Para votar ou cadastrar restaurantes, é necessário estar logado.
                </p>
            </div>
        );
    }
}