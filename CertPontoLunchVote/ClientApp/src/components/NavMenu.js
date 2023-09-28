import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LoginMenu } from './api-authorization/LoginMenu';
import './NavMenu.css';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true,
            isResultadoEnabled: false,
        };
    }

    componentDidMount() {
        // Verifica a hora atual e habilita o NavLink "Resultado" às 11:50
        this.checkResultadoEnabled();
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    checkResultadoEnabled() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Verifica se é 11:50 ou posterior para habilitar o NavLink "Resultado"
        if (currentHour >= 11 && currentMinute >= 50) {
            this.setState({
                isResultadoEnabled: true,
            });
        } else if (currentHour >= 8) {
            this.setState({
                isResultadoEnabled: false,
            });
        } else {
            // Agenda a verificação para as 8:00
            const timeUntilEnable = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0) - now;
            setTimeout(() => {
                this.checkResultadoEnabled();
            }, timeUntilEnable);
        }
    }

    render() {
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
                    <NavbarBrand tag={Link} to="/">CertPontoLunchVote</NavbarBrand>
                    <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                    <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                        <ul className="navbar-nav flex-grow">
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                            </NavItem>

                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/votacao">Votar</NavLink>
                            </NavItem>
                            <NavItem>
                                {/* O uso da propriedade isResultadoEnabled é para habilitar ou desabilitar o NavLink do Resultado de acordo com o horário*/}
                                <NavLink
                                    tag={Link}
                                    className={`text-dark ${!this.state.isResultadoEnabled && 'enabled'}`}
                                    to="/result"
                                >
                                    Resultado
                                </NavLink>
                            </NavItem>

                            <LoginMenu>
                            </LoginMenu>
                        </ul>
                    </Collapse>
                </Navbar>
            </header>
        );
    }
}