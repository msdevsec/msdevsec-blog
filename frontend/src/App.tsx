import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { styled } from 'styled-components'

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`

const Logo = styled.div`
  a {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    text-decoration: none;
    text-transform: lowercase;
  }
`

const Nav = styled.nav`
  ul {
    display: flex;
    list-style: none;
    gap: 2rem;
    align-items: center;
    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
    color: #2c3e50;
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: #3498db;
    }
  }

  .auth-link {
    padding: 0.5rem 1rem;
    border-radius: 4px;

    &.signup {
      background-color: #3498db;
      color: white;

      &:hover {
        background-color: #2980b9;
      }
    }
  }

  @media (max-width: 1024px) {
    ul {
      gap: 1rem;
    }
  }

  @media (max-width: 768px) {
    ul {
      flex-wrap: wrap;
      justify-content: center;
      text-align: center;
    }
  }
`

function App() {
  return (
    <Router>
      <Header>
        <Logo>
          <a href="/">msdevsec</a>
        </Logo>
        <Nav>
          <ul>
            <li><a href="/tutorials">Code Tutorials</a></li>
            <li><a href="/pentesting">Pentesting</a></li>
            <li><a href="/portfolio">Portfolio</a></li>
            <li><a href="/premium">Premium Content</a></li>
            <li><a href="/signin" className="auth-link">Sign in</a></li>
            <li><a href="/signup" className="auth-link signup">Sign up</a></li>
          </ul>
        </Nav>
      </Header>
    </Router>
  )
}

export default App
