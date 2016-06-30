import { take, reduce, set, get, map } from 'lodash';

export function createJson(items, active){
  const itemsToApply = take(items, active + 1);
  return reduce(itemsToApply, (result, entry, index) => {
    const active = index === itemsToApply.length - 1;
    return applyChangeSet(result, entry, active);
  }, {})
}

function applyChangeSet(result, entry, active) {
  return reduce(entry.changeSet, (updates, change) => {
    return applyChange(result, change, active, entry.userInfo);
  }, result);
}

function applyChange(result, change, active, userInfo) {
  console.log(populateChange(change, active, userInfo))
}

function populateChange(change, active, userInfo) {
  console.log(change)
  if (Array.isArray(change.rhs)) {
    return createArrayChanges(change, active, userInfo)
  } else if (typeof change.rhs === 'object') {
    return createObjectChanges(change, active, userInfo)
  } else {
    return {[createPath(change.path)] :createMetaData(change.rhs, change.lhs, change.kind, active, userInfo)}
  }
}

function createMetaData(value, previousValue, kind, active, userInfo) {
  return {
    value,
    previousValue,
    kind,
    active,
    updatedBy: userInfo.username
  }
}

function createPath(pathArray,idx) {
  const path = reduce(pathArray, (result, part, index) => {
    if (index === 0) {
      return `${part}`
    }
    if (Number.isInteger(part)) {
      return `${result}[${part}]`
    }
    return `${result}.${part}`
  });
  if (Number.isInteger(idx)) {
    return `${path}[${idx}]`
  }
  return path;
}

function createObjectChanges(change, active ,userInfo) {
  return reduce(change.rhs, (result, value, key) => {
    const newChange = {
      kind: change.kind,
      path: [...change.path,key],
      rhs: value
    }
    return [...result, populateChange(newChange, active ,userInfo)]
  }, [])
}

function createArrayChanges(change, active, userInfo) {
  return reduce(change.rhs, (result, c, index) => {
    const newChange = {
      kind: change.kind,
      path: [...change.path, index],
      rhs: c
    }
    return [...result,populateChange(newChange,active,userInfo)]
  }, [])
}