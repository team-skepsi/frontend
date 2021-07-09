import isOrcid from 'is-valid-orcid';

export function isValidEmail(email){
     if(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
       return true
     } else{
       return false
     }
}

export function isValidPassword(password){
  if (password.length < 8) {
      return false;
  }

  else if (password.search(/[0-9]/) < 0) {
      return false;
  } else {
    return true
  }
}

export function isValidUsername(username){
  if (username.length < 5){
    return false
  } else {
      return true
  }
}

export function isValidOrcid(orcid){
  if(isOrcid(orcid)){
    return true
  }
  else{
    return false
  }
}


// ORCID STUFF
// - https://github.com/ORCID/orcid-js
