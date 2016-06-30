function createDiscretePoints(items, active) {
  let spread = (100/(items.length - 1))
  return items.map((point,index) => {

    return <span className='point' style={{left:`${index*spread}%`}}>{slider}</span>
  });
}

function createSlider() {
  return <span className='slider'/>
}

function createTimePoints(items, active) {
  _.sortBy(items, 'timestamp');
  const start = new Date(items[0].timestamp).getTime();
  const end = new Date(items[items.length-1].timestamp).getTime()
  const range = end-start;
  return items.map((point,index) => {
    let slider = active === index ? createSlider() : undefined;
    const offSetTime = new Date(point.timestamp).getTime() - start;
    const offSetPercent = offSetTime/range * 100;
    return <span className='point' style={{left:`${offSetPercent}%`}}>{slider}</span>
  })
}

function displayJson(json) {
  const stuff = _.reduce(json, (result, value, key) => {
    let change;
    if (value.active) {
      change = <i className={`fa fa-asterisk ${value.kind === 'N' ? 'new' : 'edit'}`}/>
    }
    if (!_.isEmpty(value.value) && Array.isArray(value.value)) {
      result.push(
        <div className='field object'>
          <h2>{_.startCase(key)}</h2>

          <div>{value.value.map(value => displayJson(value.value))}</div>
        </div>
      );
    } else if (!_.isEmpty(value.value) && typeof value.value === 'object') {
      result.push(
        <div className='field object'>
          <h2>{_.startCase(key)}</h2>

          <div>{displayJson(value.value)}</div>
        </div>
      );
    } else if (typeof value.value === 'date') {

    } else if (value.value) {
      result.push(
        <div className={`${value.active === true && !value.child ? 'active' : ''} ${value.kind === 'N' ? 'new' : 'edit'} field`}>
          <label>{_.startCase(key)} {change}</label>
          <div>{value.value}</div>
        </div>
      )
    }

    return result
  }, [])

  return stuff
}

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      items: [{ "_id" :"57713ceac49f16c1574b9b71", "refId" : 15, "userInfo" : { "homeUnit" : "IN-CARR", "ssoId" : null, "displayName" : "McGregor, Geoff", "newId" : "56d89fa0414567aaf94e46fc", "id" : "1270282084239206147", "role" : "admin", "phone" : "321-321-1071", "schoolId" : "10000000101", "scopesCm" : null, "lastName" : "Administrator", "firstName" : "Application", "updatedAt" : 1457113471593, "createdAt" : 1445309024000, "email" : "kcnotification+appadmin@gmail.com", "username" : "appadmin", "name" : "Administrator, Application" }, "model" : "Protocol", "changeSet" : [ { "kind" : "N", "path" : [ "protocolNumber" ], "rhs" : 15 }, { "kind" : "N", "path" : [ "protocolState" ], "rhs" : "In Progress" }, { "kind" : "N", "path" : [ "piId" ], "rhs" : "10000000032" }, { "kind" : "N", "path" : [ "leadUnitNumber" ], "rhs" : "000001" }, { "kind" : "N", "path" : [ "pi" ], "rhs" : { "name" : "FLAHERTY, ANGELICA", "username" : "flaherty", "email" : "kcnotification+flaherty@gmail.com", "createdAt" : 1445309017000, "updatedAt" : 1457113463295, "firstName" : "ANGELICA", "lastName" : "FLAHERTY", "scopesCm" : null, "schoolId" : "10000000032", "phone" : "321-321-1228", "role" : "user", "id" : "1270282025422488458", "newId" : "56d89fa0414567aaf94e46ef", "displayName" : "FLAHERTY, ANGELICA", "ssoId" : null, "homeUnit" : "000001" } }, { "kind" : "N", "path" : [ "leadUnit" ], "rhs" : { "organizationId" : "000001", "parentUnitNumber" : null, "unitName" : "University", "unitNumber" : "000001", "active" : true, "_primaryKey" : "000001" } }, { "kind" : "N", "path" : [ "title" ], "rhs" : "Time Machine" }, { "kind" : "N", "path" : [ "description" ], "rhs" : "Time Machine" }, { "kind" : "N", "path" : [ "attachments" ], "rhs" : [ ] }, { "kind" : "N", "path" : [ "people" ], "rhs" : [ { "personId" : "10000000032", "isPi" : true, "researcherRole" : "Principal Investigator", "homeUnitNumber" : "000001", "contactInfo" : { "phone" : "321-321-1228", "email" : "kcnotification+flaherty@gmail.com" }, "_id" : "57713ceac49f16c1574b9b70", "attachments" : [ ], "permissions" : [ ], "contactRoles" : [ ] } ] }, { "kind" : "N", "path" : [ "createDate" ], "rhs" : "2016-06-27T14:49:14.035Z" }, { "kind" : "N", "path" : [ "version" ], "rhs" : 1 } ], "timestamp" : "2016-06-27T14:49:14.059Z", "__v" : 0 },

        { "_id" : "57713ceec49f16c1574b9b72", "refId" : 15, "userInfo" : { "homeUnit" : "IN-CARR", "ssoId" : null, "displayName" : "Administrator, Application", "newId" : "56d89fa0414567aaf94e46fc", "id" : "1270282084239206147", "role" : "admin", "phone" : "321-321-1071", "schoolId" : "10000000101", "scopesCm" : null, "lastName" : "Administrator", "firstName" : "Application", "updatedAt" : 1457113471593, "createdAt" : 1445309024000, "email" : "kcnotification+appadmin@gmail.com", "username" : "appadmin", "name" : "Administrator, Application" }, "model" : "Protocol", "changeSet" : [ { "kind" : "N", "path" : [ "questionAnswers" ], "rhs" : { "4f63e555b7bd4b2788b22a5426db3e5e" : "No clue", "f0a8c26633d84af6a3236c64dcca537d" : "Option #1", "50c283c4117c42259adc562d280d16d1" : "No" } } ], "timestamp" : "2016-06-27T14:49:18.503Z", "__v" : 0 },

        { "_id" : "57713d01c49f16c1574b9b75", "refId" : 15, "userInfo" : { "homeUnit" : "IN-CARR", "ssoId" : null, "displayName" : "Administrator, Application", "newId" : "56d89fa0414567aaf94e46fc", "id" : "1270282084239206147", "role" : "admin", "phone" : "321-321-1071", "schoolId" : "10000000101", "scopesCm" : null, "lastName" : "Administrator", "firstName" : "Application", "updatedAt" : 1457113471593, "createdAt" : 1445309024000, "email" : "kcnotification+appadmin@gmail.com", "username" : "appadmin", "name" : "Administrator, Application" }, "model" : "Protocol", "changeSet" : [ { "kind" : "E", "path" : [ "protocolState" ], "lhs" : "In Progress", "rhs" : "Submitted for Review" }, { "kind" : "N", "path" : [ "submissionNumber" ], "rhs" : 1 } ], "timestamp" : "2016-06-27T14:49:37.329Z", "__v" : 0 },

        { "_id" : "57713d07c49f16c1574b9b77", "refId" : 15, "userInfo" : { "homeUnit" : "IN-CARR", "ssoId" : null, "displayName" : "Administrator, Application", "newId" : "56d89fa0414567aaf94e46fc", "id" : "1270282084239206147", "role" : "admin", "phone" : "321-321-1071", "schoolId" : "10000000101", "scopesCm" : null, "lastName" : "Administrator", "firstName" : "Application", "updatedAt" : 1457113471593, "createdAt" : 1445309024000, "email" : "kcnotification+appadmin@gmail.com", "username" : "appadmin", "name" : "Administrator, Application" }, "model" : "Protocol", "changeSet" : [ { "kind" : "E", "path" : [ "protocolState" ], "lhs" : "Submitted for Review", "rhs" : "Approved" } ], "timestamp" : "2016-06-27T14:49:43.394Z", "__v" : 0 }],
      active: 0
    }
  }


  render() {
    const start = () => {
      this.setState({
        active: 0
      })
    }

    const previous = () => {
      this.setState({
        active: this.state.active > 0 ?
        this.state.active - 1 :
          this.state.active
      })
    }

    const next = () => {
      if (this.state.active === this.state.items.length - 1 ) {
        clearInterval(this.state.play)
        this.setState({
          play: undefined
        })
        return;
      }
      this.setState({
        active: this.state.active < this.state.items.length - 1 ?
        this.state.active + 1 :
          this.state.active
      })
    }

    const end = () => {
      this.setState({
        active: this.state.items.length - 1
      })
    }

    const play = () => {
      this.setState({
        play: setInterval(next, 1000)
      })

    }

    const stop = () => {
      clearInterval(this.state.play);
      this.setState({
        play: undefined
      })
    }
    //const points = createDiscretePoints(this.state.items, this.state.active)
    const points = createTimePoints(this.state.items, this.state.active)
    const changes = displayJson(createJson(this.state.items, this.state.active));
    return (
      <div>
      <span  className='container'>
       
        <span className='barContainer'>
          <span className='timeline'>
            {points}
          </span>
        </span>
       
      </span>
        <div className='controls'>
          <button
            disabled={this.state.active === 0 ? true : undefined}
            onClick={start}
          >
            <i className={'button fa fa-fast-backward'}/>
          </button>
          <button
            disabled={this.state.active === 0 ? true : undefined}
            onClick={previous}>
            <i className={'button fa fa-backward'}/>
          </button>
          <button
            disabled={this.state.active === this.state.items.length - 1 && !this.state.play ? true : undefined}
            onClick={this.state.play ? stop : play}
          >
            <i className={this.state.play ? 'button fa fa-stop' : 'button fa fa-play'}/>
          </button>
          <button
            disabled={this.state.active === this.state.items.length - 1 ? true : undefined}
            onClick={next}
          >
            <i className={'button fa fa-forward'}/>
          </button>
          <button
            disabled={this.state.active === this.state.items.length - 1 ? true : undefined}
            onClick={end}
          >
            <i className={'button fa fa-fast-forward'}/>
          </button>
        </div>
        <div style={{display: 'flex', justifyContent:'center'}}>
          <div className='changes'>
            <h2>Changes {this.state.items[0].model} #{this.state.items[0].refId} {this.state.items[this.state.active].timestamp}</h2>
            {changes}
          </div>
        </div>

      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app')); 