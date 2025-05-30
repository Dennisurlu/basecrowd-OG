import React from 'react';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
//import { loadNextAvailableDocument } from 'components/utils/loadNextAvailableDocument';

export class FrontPageTop extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      text:props.text,
      expanded:false,
      timeout:1200,
      solidbg:false
    }
  }

  componentDidMount(){
  }

  handleChange = () => {
    this.setState(state => ({ expanded: !state.expanded }));
    if(this.state.solidbg){
      setTimeout(() => {
              this.setState({ solidbg: false });
          }, this.state.timeout);
    } else {
      this.setState({ solidbg: true });
    }



  };


  render() {

    const { expanded, timeout, solidbg } = this.state

    let bg = {
      background:'url(/images/front/front_top_bg.jpg)',
      backgroundRepeat:'no-repeat',
      backgroundSize:'cover'
    }

    if(solidbg){
      bg = {
        backgroundColor:'#35373C'
      }

    }



    return (
      <div style={bg}>
      <div style={{padding:54, marginLeft:'auto', marginRight:'auto', maxWidth:670}}>
        <Typography variant="display1" align="center" gutterBottom style={{color:'white'}}>Den Spanske Syge i Danmark, 1918&nbsp;-&nbsp;1920</Typography>
        <Typography variant="headline" align="center" gutterBottom style={{color:'white'}}>Hjælp med kortlægge den Spanske Syges udbredelse og konsekvenser </Typography>
        <div>
              <Collapse timeout={timeout} in={expanded} collapsedHeight={"0px"}>
                <div ref={c => (this.textHolder = c)} >
                  <p></p>
                  <Typography variant="body1">
                  I det sidste år af Første Verdenskrig levede Verdens befolkning i frygt for en mystisk sygdom, der, som rygtet ville vide, kunne udslette hele landsbyer på få dage. Og værre var; rygtet talte sandt I løbet af sommeren fik sygdommen et navn: Den Spanske Influenza.
                  <br/><br/>
Dette projekt handler om 1918-pandemiens historiske kontekst: De sociale, økonomiske, kommercielle og geografiske forudsætninger samt om disses samspil med influenzapandemiens rent epidemiologiske væsen. For hermed at kunne bidrage med viden og data til et igangværende tværfagligt samarbejde om opbygningen af et data- og evidensdrevet pandemiberedskab.
<br/><br/>

Udgangspunktet er Aarhus og byens 65.000 indbyggeres oplevelse af Den Spanske Syge. Og ikke mindst hvordan den almindelige aarhusianerne reagerede på katastrofen ved at kaste sig ud ind i kampen.
<br/><br/>

Men projektet handler også om læring, oplysning og om at forene professionelle og frivillige i forskningsprocessen. Dels i indsamlingen af data, analyser og datadreven tests af afledte teorier. Dette kaldes Citizen Science, og vi inviterer dig til sammen med os til at deltage i denne proces.

                  </Typography>

                  <br/><br/>
                  {/*
                  <Typography variant="display1">
                    !!!!!! HERUNDER GAMMEL TEKST
                  </Typography>

                  <Typography variant="body1">
                    Basecrowd tilbyder dig muligheden for at deltage i forskningsprojekter og derigennem komme tæt på den humanistiske forskning. Samt gå på opdagelse i få førstehåndskendskab til de historiske kilder, der er centrale for de enkelte projekt. I tæt samarbejde med forskere, arkiver andre med en passion for historien bidrager du til at afdække centrale problemstillinger, hvis løsning kun findes ved at kombinere store mængder af historisk data.
                    <br/><br/>
                    Basecrowd er resultatet af et tæt samarbejde mellem Aarhus Stadsarkiv, Redia a/s og Syddansk Universitet. Vores mål er at udvikle og tilbyde innovative digitale værkstøjer og metoder, der gør det mulig for alle - uafhængig af interesser og kompetencer – at bidrage til at fremme og formidle forskningsbaseret viden om vores fælles kulturarv. Samt stille historisk data til rådighed for danske og udenlandske forskningsprojekter, arkiver m.fl. Kort sagt alle.
                    <br/><br/>
                    Det er vigtigt at bemærke, at siden er i udviklingsfasen. Hvilket for det første betyder, at du har afgørende indflydelse på platsidens videreudvikling. Men uheldigvis også; at du kan opleve fejl, mangler og funktioner, du finder mere forstyrrende end gavnlige.
                    <br/><br/>
                    Opdager du fejl, mangler, har spørgsmål, ris, ros eller kommentar, opfordrer vi til, at du skriver til os på <a href="mailto:skp@basecrowd.dk">skp@basecrowd.dk</a>. Kun på den måde kan vi skabe de bedste løsninger indenfor digitaliseringen af og adgangen til selve fundamentet for at opdage nye sammenhænge i vores fælles historie.
                  </Typography>
                  <br/>

                  <Typography variant="headline">Den Spanske Syge</Typography>
                  <Typography variant="body1">
                  I det første projekt er emnet 1918-pandemien (bedre kendt som Den Spanske Syge) og dennes sociale, økonomiske, geografiske og demografiske forudsætninger. Hvilke ubetinget må antages at have haft en afgørende betydning for pandemines udbredelse og udvikling. Men præcis hvordan og i hvilken grad er uklart – i hvert fald indtil videre.
                  <br/><br/>
                  Med udgangspunkt i Aarhus by og Amt er målet med projektet derfor at bidrage til løsningen af denne aktuelle problemstilling. Hertil vil vi forsøge at indsamle og forene så mange forskellige oplysninger som muligt om byens daværende 65.000 indbyggere. Hvormed pandemiens geografi, sociale profil og afhængighed af de sociale relationer mellem byens indbyggere, bogstaveligt talt kan kortlægges.
                  <br/><br/>
                  Til undersøgelsen anvendes og forenes oplysninger fra de århusianske dødsattester fra 1916 til 1921, patientjournalerne fra henholdsvis Aarhus kommunehospital og Amtssygehuset, begravelsesprotokollerne, mandtalslisterne fra 1918 samt de århusianske skolers indskrivningsprotokoller fra 1912 til 1918. Se www.aarhusskoler1918.dk
                  <br/><br/>
                  Desværre er ingen af disse kilder digitaliseret, hvorfor vi søger hjælp hertil. I det første projekt indtaster vi de århusianske dødsattester. Herefter følge begravelsesprotokollerne, patientjournaler og endeligt mandtalslisterne fra 1918. Skolernes indskrivingsprotokoller, der indeholder navn og adresse godt 14.900 elever og deres forældre/værge, er allerede indtastet takket være en lille håndfuld meget aktive frivillige.
                  <br/><br/>
                  På siden <a href="http://www.denspanskesyge.dk" rel="noopener noreferrer" target="_blank">www.denspanskesyge.dk</a> kan du læse mere om projektet, baggrunden og personerne bag projektet. Samt læse de seneste nyheder og resultater. Projektet støttes af MICA-fonden, Augustinus Fonden, Aarhus Byhistoriske Fond, Aarhus Universitetshospital og Aarhus Stadsarkiv.
                  </Typography>
                  */}
                </div>
              </Collapse>

              <div style={{display:'flex', justifyContent:'center'}}>
                <Button onClick={this.handleChange} variant='raised' color="primary"
                      style={{marginTop:20, marginLeft:'auto', marginRight:'auto', fontSize:11, fontWeight:600, color:'white', height:34}} >
                {!expanded ?
                  [

                    <span key="a">Læs mere</span>,
                    <ExpandMore key="b" />
                  ]

                :
                [
                  <span key="a">Vis mindre</span>,
                  <ExpandLess key="b" />
                ]
                }
                </Button>
              </div>


            </div>

        </div>
      </div>

    );
  }
}
