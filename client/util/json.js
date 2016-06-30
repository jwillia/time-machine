import _ from 'lodash';
export function createJson(items, active) {
  const itemsToApply = _.take(items, active + 1);
  return _.reduce(itemsToApply, (result, item, index) => {
    const updatedResult = _.reduce(_.sortBy(_.map(item.changeSet, addSort), 'sort'), (updates, change) => {
      const active = index === itemsToApply.length - 1;
      return applyChange(result, change, active, item.userInfo);
    }, result)
    return updatedResult
  }, {})
}

function addSort(change) {
  if (Array.isArray(change.rhs)) {
    change.sort = 2;
  } else if (typeof change.rhs === 'object') {
    change.sort = 1;
  } else {
    change.sort = 0;
  }
  return change
}

function createChange(change, active, userInfo) {
  const value = populateArray(populateObject(change.rhs, change.kind, active, userInfo), change.kind, active, userInfo);
  if (Array.isArray(change.rhs)) {
    return value
  }
  return {
    value,
    previousValue: change.lhs,
    active,
    kind: change.kind,
    updatedBy: userInfo.username
  }
}
function applyChange(obj, change, active, userInfo) {

  let path;
  if (change.kind === 'A') {
    path = _.reduce(change.path, (result, pathPart, index) => {
      if (index === 0 ) {
        return pathPart;
      }
      if (Number.isInteger(pathPart)) {
        return `${result}[${pathPart}]`
      }
      return  `${result}.${pathPart}`
    },'')
    path = `${path}[${change.index}].value`
    _.set(obj, path, createChange(change.item, active, userInfo))
    return obj
  }
  path = change.path.join('.');
  _.set(obj, path, createChange(change, active, userInfo))
  return obj;
}

function populateObject(obj, kind, active, userInfo) {
  if (Array.isArray(obj)) {
    return obj;
  }
  if (_.isEmpty(obj)) {
    return undefined
  }
  if (typeof obj === 'object') {
    return _.reduce(obj, (result, value, key) => {
      result[key] = {
        value: populateArray(populateObject(value, kind, active, userInfo), kind, active, userInfo),
        active,
        kind,
        updatedBy: userInfo.username,
        child: true
      }
      return result;
    }, {})
  }
  return obj;
}

function populateArray(obj, kind, active, userInfo) {
  if (Array.isArray(obj)) {
    return _.map(obj, (value) => {
      return createChange({rhs: value, kind}, active, userInfo)
    })
  }
  return obj
}