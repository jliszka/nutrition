/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

    data: {
        sex: {
            type: "radio",
            value: "F"
        },
        weight: {
            type: "number",
            decimals: 0     
        },
        height: {
            type: "number",
            decimals: 0     
        },
        ibw: {
            deps: [ "height", "weight", "sex" ],
            calc: function(height, weight, sex) {
                var base = sex == "M" ? 50 : 45.5;
                return base + (height - 60) * 2.3
                
            }
        },
        weight2: {
            deps: [ "weight", "ibw" ],
            calc: function(weight, ibw) {
                return Math.min(ibw, weight);
            }
        },
        nonprotein_kg: {
            type: "number",
            decimals: 0
        },
        protein_kg: {
            type: "number",
            decimals: 1     
        },
        nonprotein: {
            deps: [ "weight2", "nonprotein_kg" ],
            decimals: 0,
            calc: function(weight2, np) {
                return weight2 * np;
            }
        },
        protein: {
            deps: [ "weight2", "protein_kg" ],
            decimals: 1,
            calc: function(weight2, p) {
                return weight2 * p;
            }
        },

        diarrhea: {
            type: "checkbox"
        },
        fluid: {
            type: "checkbox"
        },
        diabetes: {
            type: "checkbox"
        },
        hepatic: {
            type: "checkbox"
        },
        renal34: {
            type: "checkbox"
        },
        renal5: {
            type: "checkbox"
        },
        wound: {
            type: "checkbox"
        },

        lipids_range: {
            deps: [ "nonprotein" ],
            calc: function(np) {
                var lo = np * 0.35;
                var hi = np * 0.5;
                return lo.toFixed(0) + "-" + hi.toFixed(0);
            }
        },
        lipids: {
            type: "radio",
            value: 200
        },
        amino_rec: {
            deps: [ "protein" ],
            decimals: 1,
            calc: function(p) { return p; },
            rec_for: "amino"
        },
        amino: {
            type: "number",
            decimals: 1
        },
        dextrose1_rec: {
            deps: [ "nonprotein", "lipids" ],
            decimals: 0,
            calc: function(np, lipids) {
                return Math.round((np - lipids) / 3.4 / 2);
            },
            rec_for: "dextrose1"
        },
        dextrose1: {
            type: "number",
            decimals: 0
        },
        dextrose2_rec: {
            deps: [ "dextrose1" ],
            decimals: 0,
            calc: function(d) {
                return d * 2;
            },
            rec_for: "dextrose2"
        },
        dextrose2: {
            type: "number",
            decimals: 0
        },

        volume1_rec: {
            deps: [ "amino", "dextrose1" ],
            decimals: 0,
            calc: function(a, d) {
                return Math.round(a * 10 + d / 0.7);
            },
            rec_for: "volume1"
        },
        volume1: {
            type: "number",
            decimals: 0
        },
        volume2_rec: {
            deps: [ "amino", "dextrose2" ],
            decimals: 0,
            calc: function(a, d) {
                return Math.round(a * 10 + d / 0.7);
            },
            rec_for: "volume2"
        },
        volume2: {
            type: "number",
            decimals: 0
        },
        volume1_hr: {
            deps: [ "volume1" ],
            decimals: 1,
            calc: function(v) {
                return v / 24;
            }
        },
        volume2_hr: {
            deps: [ "volume2" ],
            decimals: 1,
            calc: function(v) {
                return v / 24;
            }
        },

        k_goal: {
            deps: [ "weight2" ], // TODO: is this right?
            decimals: 0,
            calc: function(w) { return w; }
        },
        kphos_rec: {
            deps: [ "k_goal" ],
            decimals: 0,
            calc: function(k) {
                return k / 4;
            },
            rec_for: "kphos"
        },
        kphos: {
            type: "number",
            decimals: 0
        },
        kcl: {
            type: "number",
            decimals: 0
        },
        kacetate: {
            type: "number",
            decimals: 0
        },
        k_remaining: {
            deps: [ "k_goal", "kphos", "kcl", "kacetate" ],
            decimals: 0,
            calc: function(goal, kphos, kcl, kacetate) {
                return goal - kphos * 1.5 - kcl - kacetate;
            }
        },

        na_goal_rec: {
            deps: [ "volume1" ], // TODO: is this right?
            decimals: 0,
            calc: function(v) {
                return v / 1000; // TODO: is this right?
            },
            rec_for: "na_goal"
        },
        na_goal: {
            type: "number",
            decimals: 0            
        }
        naphos: {
            type: "number",
            decimals: 0
        },
        nacl: {
            type: "number",
            decimals: 0
        },
        naacetate: {
            type: "number",
            decimals: 0
        },
        na_remaining: {
            deps: [ "na_goal", "naphos", "nacl", "naacetate" ],
            decimals: 0,
            calc: function(goal, naphos, nacl, naacetate) {
                return goal - naphos - nacl - naacetate;
            }
        }


    },

    tube: {
        jevity12: { pro: 55.5, carb: 169.4, fat: 39.3, deps: [ "diarrhea" ] },
        osmolite12: { pro: 55.5, carb: 157.5, fat: 39.3, deps: [ "diarrhea" ] },
        twocal: { pro: 83.5, carb: 218.5, fat: 90.5, deps: [ "fluid" ] },
        glucerna12: { pro: 60, carb: 114.5, fat: 60, deps: [ "diarrhea", "diabetes" ] },
        glucerna15: { pro: 82.5, carb: 133.1, fat: 75, deps: [ "fluid", "diabetes" ] },
        nutrihep: { pro: 40, carb: 290, fat: 21.2, deps: [ "hepatic" ] },
        jevity15: { pro: 63.8, carb: 215.7, fat: 49.8, deps: [ "fluid" ] },
        nepro: { pro: 81, carb: 161, fat: 96, deps: [ "renal5" ] },
        suplena: { pro: 45, carb: 196, fat: 96, deps: [ "renal34" ] },
        vital1: { pro: 40, carb: 130, fat: 38.1, deps: [ "diarrhea" ] },
        vital15: { pro: 67.5, carb: 187, fat: 57.1, deps: [ "diarrhea", "fluid" ] },
        promote: { pro: 62.5, carb: 130, fat: 26, deps: [ "diarrhea", "wound" ] }
    },

    electrolytes: {
        na: { decimals: 0, min: 132, max: 145 },
        k: { decimals: 1, min: 4, max: 5.1 },
        cl: { decimals: 0, min: 96, max: 108 },
        co2: { decimals: 0, min: 22, max: 31 },
        glucose: { decimals: 0, min: 70, max: 170 },
        ca: { decimals: 1, min: 7, max: 10 }, // TODO: made up
        ca_albumin: { decimals: 2, min: 8.5, max: 19.5 },
        albumin: { decimals: 1, min: 1, max: 3 }, // TODO: made up
        mg: { decimals: 1, min: 1.8, max: 2.4 },
        phos: { decimals: 0, min: 2.6, max: 4.9 }
    },

    // Application Constructor
    initialize: function() {
        this.bindEvents();

        function setupRadio(item, e) {
            var radios = e.getElementsByClassName("radio");
            for (var i = 0; i < radios.length; i++) {
                var radio = radios[i];
                radio.ontouchstart = function(radio) {
                    for (var j = 0; j < radios.length; j++) {
                        radios[j].classList.remove("selected");
                    }
                    radio.classList.add("selected");
                    var text = radio.firstChild.textContent;
                    item.value = text.match(/^[0-9.]+$/) ? parseFloat(text) : text;
                    item.onChange();
                }.bind(this, radio);
                radio.onclick = radio.ontouchstart;
            }
        }

        function setupCheckbox(item, e) {
            item.value = item.value ? item.value : false;
            e.ontouchstart = function() {
                item.value = !item.value;
                if (item.value) {
                    e.classList.add("checked");
                } else  {
                    e.classList.remove("checked");
                }
                item.onChange();
            }
            e.onclick = e.ontouchstart;
        }

        function setupNumber(item, e) {
            e.onkeyup = function(evt) {                
                var text = e.value.replace(/[^0-9]/g,'').replace(/^0*/g, '');                
                if (text == "") {
                    if (item.value !== undefined) {
                        item.value = undefined;
                        item.onChange();
                    }
                    return;
                }
                if (item.decimals > 0) {
                    while (text.length <= item.decimals) {
                        text = "0" + text;
                    }
                    var pos = text.length - item.decimals;
                    e.value = text.substring(0, pos) + "." + text.substring(pos);
                }
                item.value = parseFloat(e.value);
                item.onChange();
            };
            e.onfocus = function() {
                e.select();
            }
        }

        function setupData(item, e) {
            for (var i = 0; i < item.deps.length; i++) {
                var k = item.deps[i];
                app.data[k].pushTo.push(key);
            }
            item.docalc = function() {
                var args = [];
                for (var i = 0; i < item.deps.length; i++) {
                    var val = app.data[item.deps[i]].value;
                    if (val === undefined) return;
                    args.push(val);
                }
                var val = item.calc.apply(item, args);
                item.value = val;
                if (e != null) {
                    if (val === true) {
                        e.classList.remove("hidden");
                    } else if (val === false) {
                        e.classList.add("hidden");
                    } else if (val !== undefined) {
                        if (typeof val == 'number') {
                            e.innerText = val.toFixed(item.decimals);
                        } else {
                            e.innerText = val;
                        }
                    }
                }
                item.onChange();
            };
            if (e != null && item.rec_for) {
                e.ontouchstart = function() {
                    var otherItem = app.data[item.rec_for];
                    otherItem.value = item.value;
                    otherItem.el.value = item.value;
                    otherItem.onChange();
                };
                e.onclick = e.ontouchstart;
            }
        }

        for (key in app.tube) {
            var t = app.tube[key];
            app.data[key] = function(t) { return {
                deps: t.deps,
                calc: function() {
                    for (var i = 0; i < arguments.length; i++) {
                        if (arguments[i] == true) return true;
                    }
                    return false;
                }
            }; }(t);
            app.data[key+"_rate"] = function(t) { return {
                deps: [ "nonprotein" ],
                decimals: 0,
                calc: function(np) {
                    return Math.round(np / (t.carb * 4 + t.fat * 9) * 1000 / 24);
                }
            }; }(t);
            app.data[key+"_pros"] = function(t) { return {
                deps: [ "nonprotein", "protein" ],
                decimals: 0,
                calc: function(np, p) {
                    return Math.round(Math.max(0, (p - np / (t.carb * 4 + t.fat * 9) * t.pro) / 15) - 0.5);
                }
            }; }(t);
        }

        for (key in app.electrolytes) {
            var t = app.electrolytes[key];
            app.data[key] = function(t) { return {
                type: "number",
                decimals: t.decimals
            }; }(t);            
            app.data[key+"_ab"] = function(t) { return {
                deps: [ key ],
                calc: function(val) {
                    if (val > t.max)
                        return val - t.max;
                    if (val < t.min)
                        return val - t.min;
                    return 0;
                }
            }; }(t);            
        }

        for (key in app.data) {
            app.data[key].pushTo = [];
        }
        for (key in app.data) {
            var item = app.data[key];
            item.onChange = function(item) {
                for (var i = 0; i < item.pushTo.length; i++) {
                    app.data[item.pushTo[i]].docalc();
                }
            }.bind(this, item)
            var e = document.getElementById(key);
            item.el = e;
            if (item.type == "radio") {
                setupRadio(item, e);
            } else if (item.type == "checkbox") {
                setupCheckbox(item, e);
            } else if (item.type == "number") {
                setupNumber(item, e);
            } else if (item.type == null) {
                setupData(item, e);
            }
        }
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        document.getElementById('tpnStart').ontouchstart = app.tpn;
        document.getElementById('tubeFeedingStart').ontouchstart = app.tubeFeeding;
        app.showScreen("home");
    },

    showScreens: function(screens) {
        for (var i = 0; i < screens.length; i++) {
            var e = document.getElementById(screens[i]);
            e.classList.add("active");
        }
    },

    tpn: function() {
        app.showScreens([ "patient", "tpn" ]);
    },

    tubeFeeding: function() {
        app.showScreens([ "patient", "tube" ]);
    }


};

app.initialize();
app.tpn();