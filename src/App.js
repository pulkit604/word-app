import './App.css';
import {
    Alert,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle, Grid, Paper, styled,
    TextField,
    Typography
} from "@mui/material";
import {useState} from "react";
import Sparkles from 'react-sparkle';
import introVideo from "./assets/ai.mp4";
import Confetti from 'react-confetti'

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function TextInput({ id, label }) {
    const [word, setWord] = useState("");

    return (<TextField
            required
            id={ id }
            label={ label }
            value={word}
            onChange={(e) => setWord(e.target.value)}
            variant="filled" />
    )
}

function DialogC(props) {
    const { onClose, selectedValue, open } = props;
    const handleClose = () => {
        onClose(selectedValue);
    };
    return props.which === 'intro' ? (
        <Dialog onClose={handleClose} open={open}>
            Click outside the box, to go to page!
            <video autoPlay controls loop src={introVideo} />
        </Dialog>
    ) : (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Result from Server</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <b>{props.count}</b> characters '<b>{ props.chars }</b>' occured in the given input!
                </DialogContentText>
                <iframe title="sgif" src="https://giphy.com/embed/IS9LfP9oSLdcY" width="100%" height="100%"
                        frameBorder="0" className="giphy-embed" allowFullScreen/>
            </DialogContent>
        </Dialog>
    )
}

function SendButton({ title, onButtonClick }) {
  return (
      <Button type="submit" className="app-btn" onClick={onButtonClick} variant="contained">{ title }</Button>
  )
}

function ShowAlert(message) {
    const [visible] = useState(false);

    if(!visible) return null;
    return (
        <Alert severity="error" >{ message }</Alert>
    )
}

function App() {
    const [open, setOpen] = useState(true);
    const [ which, setWhich ] = useState('intro');
    const [ chars, setChars ] = useState('');
    const [ count, setCount ] = useState('');
    const [ showConfetti, setShowConfetti ] = useState(0);

    const handleClose = () => {
        setOpen(false);
    };

    function callStringCheckApi(event) {
        event.preventDefault();
        var [mainWord, searchWord] = [document.getElementById('main-word').value, document.getElementById('search-word').value];
        if(mainWord === '' || searchWord === '') {
            this.setState('visible', true);
        }
        fetch('http://127.0.0.1:5000/checkString', {
            method: 'POST',
            body: JSON.stringify({
                mainWord: mainWord,
                searchWord: searchWord
            })
        }).then(response => response.json())
            .then(response => {
                setShowConfetti(1080)
                setWhich('result')
                setChars(response['chars'])
                setCount(response['count'])
                setOpen(true)
            })
    }

    return (
    <div className="App">
        <Sparkles/>
        <Confetti width={showConfetti}/>
        <DialogC
            open={open}
            onClose={handleClose}
            which={which}
            chars={chars}
            count={count}
        />
        <Paper elevation={24} width="70%">
            <header className="App-header">
                <Typography variant="h3" gutterBottom>
                    Character Occurrence Checker
                </Typography>
                <Typography variant="h5">
                    Detect overlapping words within words
                </Typography>
            </header>
            <Grid container>
                <form onSubmit={callStringCheckApi}>
                    <Grid xs="auto">
                        <Item>
                            <TextInput id="main-word" label="Main Word" />
                            <TextInput id="search-word" label="Search Word" />
                        </Item>
                    </Grid>
                    <Grid xs="auto">
                        <Item>
                            <ShowAlert visible={false} message="Please check the inputted words again!" />
                        </Item>
                    </Grid>
                    <Grid xs="auto">
                        <Item>
                            <SendButton title="Check String" />
                        </Item>
                    </Grid>
                </form>
            </Grid>
        </Paper>
    </div>
  );
}

export default App;
