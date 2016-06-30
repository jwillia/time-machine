import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import moment from 'moment';
import { protocol1, protocol2 } from './util/data';
import { createJson } from './util/json2';



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

function createReferencePoints(items) {
  _.sortBy(items, 'timestamp');
  const start = new Date(items[0].timestamp).getTime();
  const end = new Date(items[items.length-1].timestamp).getTime()
  const range = end-start;
    return [
      <span className='reference point' style={{left:`${0}%`}}><span className="referenceInfo">{moment(start).format('LTS')}</span></span>,
      <span className='reference point' style={{left:`${25}%`}}><span className="referenceInfo">{moment(start + range/4).format('LTS')}</span></span>,
      <span className='reference point' style={{left:`${50}%`}}><span className="referenceInfo">{moment(start + range/2).format('LTS')}</span></span>,
      <span className='reference point' style={{left:`${75}%`}}><span className="referenceInfo">{moment(start + (range/4 *3)).format('LTS')}</span></span>,
      <span className='reference point' style={{left:`${100}%`}}><span className="referenceInfo">{moment(end).format('LTS')}</span></span>
    ]

}

function createRootChanges(json, filter, onClick, moreInfo ) {
  return _.reduce(json, (result, value, key) => {
    if (value && filter && !value.active) {
      return result;
    }
    if  (value && value.value && !Array.isArray(value) && typeof value.value !== 'object') {
      result.push(createField(key, value, onClick, moreInfo))
    }
    return result;
  }, []);
}

function createObjectChanges(json, filter) {
  return _.reduce(json, (result, value, key) => {
     if (value && !_.isEmpty(value.value) && !Array.isArray(value) && typeof value.value === 'object') {
      result.push(createObjectField(key, value, filter))
    }
    return result;
  }, []);
}


function createArrayChanges(json, filter) {

  return _.reduce(json, (result, value, key) => {
    if (Array.isArray(value) && !_.isEmpty(value)) {
      const content = _.map(value, (item, index) => {
        let noKeyFields;
        if (typeof item.value !== 'object' && !Array.isArray(item.value)) {
          noKeyFields = createNoKeyField(item, filter);
          if (!_.isEmpty(noKeyFields)) {
            return noKeyFields
          }
        }
        const rootChange = createRootChanges(item.value, filter);
        const objectChanges = createObjectChanges(item.value, filter);
        const arrayChanges = createArrayChanges(item.value, filter)
        if ((!_.isEmpty(rootChange) && rootChange.some(c => c !== undefined) ||
          (!_.isEmpty(objectChanges) && objectChanges.some(c => c !== undefined)) ||
          (!_.isEmpty(arrayChanges) && arrayChanges.some(c => c !== undefined)))) {
          return (
            <div className="field object">
              <h2>{index}</h2>
              {rootChange}
              {objectChanges}
              {arrayChanges}
            </div>
          )
        }
      });
      if (content.some(c => c !== undefined)) {
        result.push(
          <div className='field object'>
            <h2>{key}</h2>
            {content}
          </div>
        )
      }
    }
    return result;
  }, []);


}

function createObjectField(key, value, filter) {

  const rootChange = createRootChanges(value.value, filter);
  const objectChanges = createObjectChanges(value.value, filter);
  const arrayChanges = createArrayChanges(value.value, filter)

  if ((!_.isEmpty(rootChange) && rootChange.some(c => c !== undefined) ||
    (!_.isEmpty(objectChanges) && objectChanges.some(c => c !== undefined)) ||
    (!_.isEmpty(arrayChanges) && arrayChanges.some(c => c !== undefined)))) {
    return (
      <div className='field object'>
        <h2>{_.startCase(key)}</h2>

        <div>
          {rootChange}
          {objectChanges}
          {arrayChanges}
        </div>
      </div>
    )
  }

}

function createNoKeyField(value, filter) {
  if (value && filter && !value.active) {
    return undefined;
  }
  let changeClass = '';
  if (value.active) {
    changeClass = value.kind === 'N' ? 'active new' : value.kind === 'D' ? 'active delete' : 'active edit'
  }

  return (
    <div className={`field ${changeClass}`}>
      <div>
        <span className='value'>{value.value}</span>
        <div className='updatedBy'>
          ({value.updateUser.username})
        </div>
      </div>
    </div>
  )
}
function createField(key, value, onClick, moreInfo) {
  let changeClass = '';
  if (value.active) {
    changeClass = value.kind === 'N' ? 'active new' : value.kind === 'D' ? 'active delete' : 'active edit'
  }

  let oldValue;
  if (value.previousValue && value.active) {
    oldValue = <span className='value old'>{value.previousValue.toString()}</span>
  }

  let modal
  if (moreInfo === key) {
    modal = (
      <div className='modal'>
        <h2>{_.startCase(key ? key : '')}</h2>
        <button onClick={() => {onClick('')}}>close</button>
        <div>
          {JSON.stringify(value)}
        </div>
      </div>
    )
  }
  return (

      <div className={`field ${changeClass}`}>
        <span onClick={() => {onClick(key)}}>
          <label>{_.startCase(key ? key : '')}</label>
          <div className='updatedBy'>
            ({value.updateUser.username})
          </div>
          <div>
            {oldValue}
            <span className='value'>{value.value.toString()}</span>

          </div>
        </span>
        {modal}
      </div>


  )
}

function createButton(disabled, onClick, icon) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
    >
      <i className={`button fa fa-${icon}`}/>
    </button>
  )
}

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      items: protocol1,
      active: 0,
      filter: true
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

    const moreInfo = (key) => {
      console.log(key);
      console.log('dragon')
      this.setState({
        moreInfo: key
      });
    }

    const points = createTimePoints(this.state.items, this.state.active)
    const referencePoints = createReferencePoints(this.state.items, this.state.active)
    const json = createJson(this.state.items, this.state.active);
    const rootChanges = createRootChanges(json, this.state.filter, moreInfo, this.state.moreInfo );
    const objectChanges = createObjectChanges(json, this.state.filter);
    const arrayChanges = createArrayChanges(json, this.state.filter);

    const date = moment(this.state.items[this.state.active].timestamp);
    return (
      <div>
      <span  className='container'>

        <span className='barContainer'>
          <span className='timeline'>
            {referencePoints}
            {points}
          </span>
        </span>

      </span>
        <div className='controls'>
          {createButton(this.state.active === 0 ? true : undefined, start, 'fast-backward')}
          {createButton(this.state.active === 0 ? true : undefined, previous, 'backward')}
          {createButton(this.state.active === this.state.items.length - 1 && !this.state.play ? true : undefined,
            this.state.play ? stop : play,
            this.state.play ? 'stop' : 'play')
          }
          {createButton(this.state.active === this.state.items.length - 1 ? true : undefined, next, 'forward')}
          {createButton(this.state.active === this.state.items.length - 1 ? true : undefined, end, 'fast-forward')}
        </div>

        <div style={{display: 'flex', justifyContent:'center'}}>
          <div className='changes'>
            <h2>{this.state.items[0].model} #{this.state.items[0].refId} {date.format('ll')} {date.format('LTS')}</h2>
            <button className='filterButton' onClick={() => {this.setState({filter: !this.state.filter})}}>
              {this.state.filter ? 'Show All' : 'Only Changes'}
            </button>
            {rootChanges}
            {objectChanges}
            {arrayChanges}
          </div>
        </div>

      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));