const $ = id => document.getElementById(id);

const weatherText = {
  0:["晴","☀️"],1:["基本晴","🌤️"],2:["局部多云","⛅"],3:["阴","☁️"],
  45:["雾","🌫️"],48:["雾凇","🌫️"],51:["小毛毛雨","🌦️"],53:["毛毛雨","🌦️"],
  55:["较强毛毛雨","🌧️"],61:["小雨","🌧️"],63:["中雨","🌧️"],65:["大雨","🌧️"],
  71:["小雪","🌨️"],73:["中雪","🌨️"],75:["大雪","❄️"],80:["阵雨","🌦️"],
  81:["较强阵雨","🌧️"],82:["强阵雨","⛈️"],95:["雷雨","⛈️"],96:["雷雨伴冰雹","⛈️"],99:["强雷雨伴冰雹","⛈️"]
};

function weatherInfo(code){ return weatherText[code] || ["未知","🌡️"]; }

async function geocode(city){
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh&format=json`;
  const r = await fetch(url); if(!r.ok) throw new Error("城市搜索失败");
  const d = await r.json(); if(!d.results?.length) throw new Error("找不到这个城市");
  return d.results[0];
}

async function loadWeather(city){
  $("status").textContent = "正在查询…";
  $("weather").classList.add("hidden");
  $("forecast").innerHTML = "";
  const place = await geocode(city);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
  const r = await fetch(url); if(!r.ok) throw new Error("天气数据获取失败");
  const d = await r.json();
  const [desc, icon] = weatherInfo(d.current.weather_code);

  $("location").textContent = `${place.name}${place.admin1 ? " · "+place.admin1 : ""}${place.country ? " · "+place.country : ""}`;
  $("temp").textContent = `${Math.round(d.current.temperature_2m)}°`;
  $("desc").textContent = `${desc} · ${d.current.weather_code}`;
  $("icon").textContent = icon;
  $("feels").textContent = `${Math.round(d.current.apparent_temperature)}°`;
  $("humidity").textContent = `${d.current.relative_humidity_2m}%`;
  $("wind").textContent = `${Math.round(d.current.wind_speed_10m)} km/h`;

  d.daily.time.forEach((date,i)=>{
    const [text,ic] = weatherInfo(d.daily.weather_code[i]);
    const dt = new Date(date+"T12:00:00");
    const day = ["周日","周一","周二","周三","周四","周五","周六"][dt.getDay()];
    $("forecast").insertAdjacentHTML("beforeend",
      `<div class="day"><b>${i===0?"今天":day}</b><div class="dicon">${ic}</div><small>${text}</small><div>${Math.round(d.daily.temperature_2m_max[i])}° / ${Math.round(d.daily.temperature_2m_min[i])}°</div></div>`);
  });
  $("status").textContent = "";
  $("weather").classList.remove("hidden");
}

$("searchBtn").onclick = ()=>loadWeather($("city").value.trim() || "Los Angeles").catch(e=>$("status").textContent=e.message);
$("city").addEventListener("keydown",e=>{if(e.key==="Enter")$("searchBtn").click()});
loadWeather("Los Angeles").catch(e=>$("status").textContent=e.message);