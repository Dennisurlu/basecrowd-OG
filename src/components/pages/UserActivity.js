import React from 'react';
import firebase from 'firebase/app';
import Typography from '@material-ui/core/Typography';

export class UserActivity extends React.Component {


  constructor(props){
      super(props);
      this.state = {};
  }

  componentDidMount(){
    this.loadUsers();
  }

  loadUsers = () =>  {
    console.log("loadUsers");
    const ref = firebase.firestore().collection('users')

    let users = [];
    ref.get()
    .then(querySnapshot => {
        querySnapshot.forEach(data => {
            var key = data.id;
            const user = data.data();
            user.key = key;
            user.epoch = user.lastUpdate ? user.lastUpdate.date : 0;
            users.push(user);
        });
        users = this.sortByKey(users, "epoch")
        this.setState({users:users});
    })
    .catch(function(error) {
        console.error("Error getting users: ", error);
    });
  }

  sortByKey = (array, key) => {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return y - x;
    });
  }

  render() {
    const { users } = this.state;

    const cell = {
      display:'table-cell',
      paddingLeft:10
    }

    var elms = [];

    if (!users) {
      elms.push(<p key="a">Indlæser brugeraktivitet</p>);
    } else {
      if(Object.keys(users).length > 0){
        elms.push(<div style={{display:'table-row'}} key="header">
                    <div style={cell}>Id</div>
                    {/*
                      <div style={cell}>date epoch</div>
                    */}
                    <div style={cell}>date string</div>
                    <div style={cell}>felt</div>
                    <div style={cell}>value</div>
                  </div>);

        for (var i = 0; i < users.length; i++) {

          //console.log(key, collections[key]);
          //elms.push(<div key={key}><p >Samling: <Link to={path} >{key} - {collections[key].complete_count} af {collections[key].document_count}</Link></p></div>);
            const user = users[i];
            const key = user.key;
            //const dateEpoch = user.lastUpdate ? user.lastUpdate.date : "-";
            const dateString = user.lastUpdate ? user.lastUpdate.dateString : "-";
            const field = user.lastUpdate ? user.lastUpdate.project + "/" + user.lastUpdate.collection + "/" + user.lastUpdate.document  + "/"+ user.lastUpdate.fieldid : "-";
            const value = user.lastUpdate ? user.lastUpdate.value : "-";

            elms.push(<div style={{display:'table-row'}} key={key}>
                        <div style={cell}><code>{key}</code></div>
                        {/*
                        <div style={cell}><code>{dateEpoch}</code></div>
                        */}

                        <div style={cell}><code>{dateString}</code></div>
                        <div style={cell}><code>{field}</code></div>
                        <div style={cell}><code>{value}</code></div>
              </div>);


        }
      } else {
        elms.push(<p>Ingen tilgængelige collections for denne bruger i dette projekt</p>);
      }

    }




    return (
      <div>
        <Typography variant="headline">Brugeraktivitet</Typography>
        <div style={{display:'table'}}>
          {elms}
        </div>
      </div>

    );
  }
}
