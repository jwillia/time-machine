import { take, reduce, set, get, map } from 'lodash';

export function createJson(items, active){
  const itemsToApply = take(items, active + 1);
  return reduce(itemsToApply, (result, item, index) => {
    return reduce(item.changeSet, (updates, change) => {
      const active = index === itemsToApply.length - 1;
      return applyChange(result, change, active, item.userInfo, item.timestamp);
    }, result)
  }, {})
}

function createPath(json, pathArray, idx) {
  const path = reduce(pathArray, (result, part, index) => {
    let newPath;
    if (index === 0) {
       newPath = `${part}`
    } else
    if (Number.isInteger(part)) {
      newPath = `${result}[${part}]`
    } else {
      newPath = `${result}.${part}`
    }
   const existing = get(json, newPath)
    if (existing && !Array.isArray(existing) && index !== pathArray.length - 1) {
      return `${newPath}.value`
    }
    return newPath;
  }, '');
  if (Number.isInteger(idx)) {
    return `${path}[${idx}]`
  }
  return path;
}

function applyChange(result, change, active, userInfo, timestamp) {
  let path = createPath(result, change.path, change.index);
  if (path === 'questionAnswers.value.50c283c4117c42259adc562d280d16d1.value') {
    console.log(change.rhs)
  }
  if (change.kind === 'A') {
    result = applyChange(result, {path: change.path, kind: change.item.kind, rhs: change.item.rhs, index: change.index}, active, userInfo);
  } else
  if (Array.isArray(change.rhs)) {
    set(result, path, populateArray(change.rhs, change.kind, active, userInfo))
  } else
  if (typeof change.rhs === 'object') {
    set(result, path, createMetaData(populateObject(change.rhs, change.kind, active, userInfo), undefined, change.kind, active, userInfo, timestamp))
  } else {
    set(result, path, createMetaData(change.rhs, change.lhs, change.kind, active, userInfo, timestamp))
  }


  return result;
}

function createMetaData(value, previousValue, kind, active, updateUser, timestamp) {
  return {
    value,
    previousValue,
    kind,
    active,
    updateUser,
    timestamp
  }
}

function populateArray(array, kind, active, userInfo) {
  return map(array, (item) => {
    if (Array.isArray(item)) {
      return populateArray(item, kind, active, userInfo);
    } else if (typeof item === 'object') {
      return createMetaData(populateObject(item, kind, active, userInfo), undefined, kind, active, userInfo)
    } else {
      return createMetaData(item, undefined, kind, active, userInfo)
    }
  })
}

function populateObject(value, kind, active, userInfo) {
  return reduce(value, (result, value, key) => {
   if (Array.isArray(value)) {
     result[key] = populateArray(value, kind, active, userInfo);
   } else if (typeof value === 'object') {
     result[key] = createMetaData(populateObject(value, kind, active, userInfo), undefined, kind, active, userInfo)
   } else {
     result[key] = createMetaData(value, undefined, kind, active, userInfo)
   }
    return result;

  }, {})
}