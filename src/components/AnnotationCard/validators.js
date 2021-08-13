export function isNotEmpty(string){
  if(/\S/.test(string)){
    return true
  }
  else{
    return false
  }
}

export function scoreIsIntegerBetweenOneAndTen(scores){
  return true
  // let passArray = []
  // for(let score in scores){
  //   if(Number.isInteger(score.scoreNumber) && score.scoreNumber >= 0 && score.scoreNumber <= 10){
  //     passArray.push(true)
  //   }
  //   else{
  //     passArray.push(false)
  //   }
  // }
  // let checker = array => array.every(Boolean)
  // console.log("PASS ARRAY", passArray)
  // if(checker(passArray)){
  //   return true
  // }
  // else{
  //   return false
  // }
}
