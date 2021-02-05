import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

const homePage = () => {
    return (
        <div>
            <Container style={{marginTop:'7em'}}>
                <h1>home Page</h1>
                <h3>go to <Link to={'/activities'}>activities</Link></h3>
            </Container>
        </div>
    )
}

export default homePage
