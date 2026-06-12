import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function PlaceholderPage({ title }) {
    return (
        <Container className="mt-5 text-center">
            <Row>
                <Col>
                    <h2 className="mb-4">{title}</h2>
                    <p className="text-muted">
                        Ushbu sahifa hozircha ishlab chiqilmoqda. Tez orada to'liq ishga tushadi!
                    </p>
                    <i className="fas fa-tools fa-5x text-primary mt-3"></i>
                </Col>
            </Row>
        </Container>
    );
}

export default PlaceholderPage;
