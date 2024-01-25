import { Container, Link, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Container
            component='footer'
            maxWidth='xl'
            style={{ marginTop: '2rem', padding: '1rem' }}
        >
            <Typography variant='body2' color='textSecondary' align='center'>
                © {new Date().getFullYear()} ACE Dashboard. All rights
                reserved.
            </Typography>
            <Typography variant='body2' color='textSecondary' align='center'>
                Crafted by{' '}
                <Link
                    color='inherit'
                    href='https://github.com/NotOpenAI'
                    target={'_blank'}
                >
                    NotOpenAI
                </Link>
            </Typography>
        </Container>
    );
};

export default Footer;
