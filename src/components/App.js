import React, { Component } from 'react'
import { connect } from 'react-redux'
import Shape from "../Shape.svg"

class App extends Component {
    componentDidMount(){
        this.map();
    }

    map = () => {
        const ymaps = window.ymaps;

        ymaps.ready(init);

        let returnPointsArray = () => {
            return this.props.PointStore;
        };

        function init(){
            var myMap = new ymaps.Map("map", {
                center: [55.76, 37.64],
                controls: [],
                zoom: 15
            });


            let myroute;
            let myGeoObjects = new ymaps.GeoObjectCollection({});

            function newRoute() {
                //Удаляем предыдущий маршрут
                myMap.geoObjects.remove(myroute);

                //Получаем элименты списка
                let listItems = document.getElementById('listWrap').getElementsByTagName('img');

                listItems = Array.prototype.slice.call(listItems);

                listItems.map((item) =>
                {
                    return item.onclick = () =>
                    {
                        return setTimeout(newRoute, 100);
                    };
                });

                //Получаем список точек
                let pointsArr = returnPointsArray();

                //Создание метки или маршрута в зависимоти от количества заданных точек
                if (pointsArr.length === 0){
                    //Удаляем метку с карты
                    myGeoObjects.removeAll();
                } else if (pointsArr.length === 1){
                    //Создание метки на карте
                    let geoPoint = ymaps.geocode(pointsArr[0])

                    geoPoint.then(
                        (res) => {
                            if(res.metaData.geocoder.found){
                                let coords = res.geoObjects.get(0).geometry.getCoordinates()

                                let myPlacemark = new ymaps.Placemark(coords, {
                                    balloonContent: pointsArr[0]
                                });

                                myGeoObjects.removeAll();
                                myGeoObjects.add(myPlacemark);

                                myMap.geoObjects.add(myGeoObjects);
                                myMap.setCenter(coords);
                            } else {
                                alert('Ошибка');
                            }
                        },
                        (err) => {
                            alert('Ошибка ' + err.message);
                        }
                    );
                } else if (pointsArr.length > 1){
                    //Создвем новый маршрут, если точек больше 1
                    ymaps.route(pointsArr, { mapStateAutoApply: true }).then((route) => {
                            myGeoObjects.removeAll();
                            myGeoObjects.add(route);
                            myMap.geoObjects.add(myGeoObjects);
                            myroute = route;
                            let editing = false;

                            document.getElementById('editButton').onclick = () => {
                                if (editing) {
                                    route.editor.stop();
                                } else {
                                    route.editor.start({ editWayPoints: true });
                                }
                                editing = !editing
                            };
                        },
                        (error) => {
                            alert('Возникла ошибка: ' + error.message);
                        });

                }
            }

            document.getElementById('addButton').onclick = () => {
                return setTimeout(newRoute, 100);
            };

            document.getElementById('inputField').onkeypress = (e) => {
                if (e.keyCode === 13){
                    return setTimeout(newRoute, 100);
                }
            };
        }
    }

    addPoint = () => {
        if(this.pointInput.value !== ''){
            this.props.onAddPoint(this.pointInput.value);
            this.pointInput.value = '';
        }
    }

    removePoint = (index) => {
        this.props.onRemovePoint(index);
    }

    handlePressEnter = (e) => {
        if (e.key === 'Enter') {
            this.addPoint();
        }
    }

    render() {
        const pointList = this.props.PointStore.map((point, index) =>
            <li className="routeItem" key={index} id={index} >
                <p>
                    {point}
                </p>
                <img src={Shape} onClick={() => {this.removePoint(index)}} alt="" />
            </li>
        )

        return (
            <div className="routeWrap">
                <div className="routeBlock" >
                    <span className="form">
                        <input id="inputField" type="text" placeholder="Введите точку маршрута" ref={(input => { this.pointInput = input })} onKeyPress={this.handlePressEnter}/>
                        <button id="addButton" onClick={ this.addPoint }> Добавить </button>
                    </span>
                    <ul id="listWrap" >
                        { pointList }
                    </ul>
                </div>
            </div>
        );
    }
}

export default connect(
  state => ({
      PointStore: state
  }),
  dispatch => ({
      onAddPoint: (pointName) => {
          dispatch({ type: 'ADD_POINT', payload: pointName })
      },
      onRemovePoint: (index) => {
          dispatch({ type: 'REMOVE_POINT', payload: index })
      }
  })
)(App);
