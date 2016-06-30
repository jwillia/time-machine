function createJson(items, active) {
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

function applyChange(obj, change, active, userInfo) {
  const path = change.path.join('.');

  _.set(obj, path, {
    value: populateArray(populateObject(change.rhs, change.kind, active, userInfo), change.kind, active, userInfo),
    previousValue: change.lhs,
    active,
    kind: change.kind,
    updatedBy: userInfo.displayName
  })
  return obj;
}

function populateObject(obj, kind, active, userInfo) {
  if (_.isEmpty(obj)) {
    return undefined
  }
  if (Array.isArray(obj)) {
    return obj;
  }
  if (typeof obj === 'object') {
    return _.reduce(obj, (result, value, key) => {
      result[key] = {
        value: populateArray(populateObject(value, kind, active, userInfo), kind, active, userInfo),
        active,
        kind,
        updateBy: userInfo.username,
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
      return {
        value: populateArray(populateObject(value, kind, active, userInfo), kind, active, userInfo),
        active,
        kind,
        updateBy: userInfo.username,
        child: true
      }
    })
  }
  return obj
}