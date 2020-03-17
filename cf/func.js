var fdk = require('@fnproject/fdk');

var CodiceFiscale = {}

// WARINING: Does not manage "omocodie" - same generated codes for persons with same name, town, birth date, gender

CodiceFiscale.town_codes = require('./comuni.json') // Load town codes from file comuni.json - update as required

CodiceFiscale.months = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T']

CodiceFiscale.control_char_odd = {
  0:1,  1:0,  2:5,  3:7,  4:9,  5:13, 6:15, 7:17, 8:19,
  9:21, A:1,  B:0,  C:5,  D:7,  E:9,  F:13, G:15, H:17,
  I:19, J:21, K:2,  L:4,  M:18, N:20, O:11, P:3,  Q:6,
  R:8,  S:12, T:14, U:16, V:10, W:22, X:25, Y:24, Z:23
  }

CodiceFiscale.control_char_even = {
  0:0,  1:1,   2:2,  3:3,   4:4,  5:5,  6:6,  7:7,  8:8,
  9:9,  A:0,   B:1,  C:2,   D:3,  E:4,  F:5,  G:6,  H:7,
  I:8,  J:9,   K:10, L:11,  M:12, N:13, O:14, P:15, Q:16,
  R:17, S:18,  T:19, U:20,  V:21, W:22, X:23, Y:24, Z:25
  }

CodiceFiscale.control_char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

CodiceFiscale.eval_control_char = function(tax_code) { // tax code is Italian "Codice Fiscale"
  var i, val = 0
  for ( i = 0; i < 15; i++ ) {
    var c = tax_code[i]
    if ( i % 2 )
      val += this.control_char_even[c]
    else
      val += this.control_char_odd[c]
  }
  val = val % 26
  return this.control_char.charAt(val)
}

CodiceFiscale.get_consonants = function(str) {
  return str.replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi, '')
}

CodiceFiscale.get_vowels = function(str) {
  return str.replace(/[^AEIOU]/gi, '')
}

CodiceFiscale.eval_surname_code = function(surname) {
  var surname_code = this.get_consonants(surname)
  surname_code += this.get_vowels(surname)
  surname_code += 'XXX'
  surname_code = surname_code.substr(0, 3)
  return surname_code.toUpperCase()
}

CodiceFiscale.eval_name_code = function(name) {
  var name_code = this.get_consonants(name)
  if ( name_code.length >= 4 ) {
    name_code =
      name_code.charAt(0) +
      name_code.charAt(2) +
      name_code.charAt(3)
  } else {
    name_code += this.get_vowels(name)
    name_code += 'XXX'
    name_code = name_code.substr(0, 3)
  }
  return name_code.toUpperCase()
}

CodiceFiscale.eval_date_code = function(dd, mm, yy, gender) {
  var d = new Date()
  d.setYear(yy)
  d.setMonth(mm - 1)
  d.setDate(dd)
  var year = "0" + d.getFullYear()
  year = year.substr(year.length - 2, 2)
  var month = this.months[d.getMonth()]
  var day = d.getDate()
  if (gender.toUpperCase() == 'F') day += 40
  day = "0" + day
  day = day.substr(day.length - 2, 2)
  return "" + year + month + day
}

CodiceFiscale.find_town=function(pattern_town) {
  var tax_code, town, ret = []
  var str = ""
  var quoted = pattern_town.replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1")
  var re = new RegExp("\\b" + quoted + "\\b", "gi")

  for (tax_code in this.town_codes) {
    town = this.town_codes[tax_code]
    if (town.match(re))
      ret.push([town,tax_code])
  }

  for (i = 0; i < ret.length; i++) {
    str = ret[i][0].slice(0, ret[i][0].indexOf(' ('))
    if (str === quoted)
      return ret[i]
  }
}

CodiceFiscale.eval_town_code = function(pattern_town) {
  if(pattern_town.match(/^[A-Z]\d\d\d$/ig))
    return this.find_town(pattern_town)[1]
  return this.find_town(pattern_town)[1]
}

CodiceFiscale.eval_tax_code = function(name, surname, gender, day, month, year, town) {
  var tax_code =
    this.eval_surname_code(surname) +
    this.eval_name_code(name) +
    this.eval_date_code(day, month, year, gender) +
    this.eval_town_code(town)
  tax_code += this.eval_control_char(tax_code)
  return tax_code
}

fdk.handle(function(input, ctx) {
  if (input.name) {
    var codice = CodiceFiscale.eval_tax_code(
                  input.name,
                  input.surname,
                  input.gender,
                  input.day,
                  input.month,
                  input.year,
                  input.town)
    let hctx = ctx.httpGateway
    hctx.setResponseHeader('Access-Control-Allow-Origin', '*')
    response = {'message': codice}
    return response
  }
  else {
    return {'message': 'Input error, please verify the payload!'}
  }
})
