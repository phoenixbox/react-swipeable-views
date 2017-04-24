'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactNative = require('react-native');

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _reactSwipeableViewsCore = require('react-swipeable-views-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = _reactNative.StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden'
  },
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  slide: {
    flex: 1
  }
});

// I couldn't find a public API to get this value.
//  weak
/**
 * This is an alternative version that use `Animated.View`.
 * I'm not sure what version give the best UX experience.
 * I'm keeping the two versions here until we figured out.
 */

function getAnimatedValue(animated) {
  return animated._value; // eslint-disable-line no-underscore-dangle
}

var SwipeableViews = function (_Component) {
  (0, _inherits3.default)(SwipeableViews, _Component);

  function SwipeableViews() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, SwipeableViews);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = SwipeableViews.__proto__ || (0, _getPrototypeOf2.default)(SwipeableViews)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _this.handleAnimationFinished = function (params) {
      // The animation can be aborted.
      // We only want to call onTransitionEnd when the animation is finished.
      if (_this.props.onTransitionEnd && params.finished) {
        _this.props.onTransitionEnd();
      }
    }, _this.panResponder = undefined, _this.startX = 0, _this.startIndex = 0, _this.handleTouchStart = function (event, gestureState) {
      if (_this.props.onTouchStart) {
        _this.props.onTouchStart(event, gestureState);
      }

      _this.startX = gestureState.x0;
      _this.startIndex = getAnimatedValue(_this.state.indexCurrent);
    }, _this.handleTouchMove = function (event, gestureState) {
      var _this$props = _this.props,
          children = _this$props.children,
          onSwitching = _this$props.onSwitching,
          resistance = _this$props.resistance;

      var _computeIndex = (0, _reactSwipeableViewsCore.computeIndex)({
        children: children,
        resistance: resistance,
        pageX: gestureState.moveX,
        startIndex: _this.startIndex,
        startX: _this.startX,
        viewLength: _this.state.viewLength
      }),
          index = _computeIndex.index,
          startX = _computeIndex.startX;

      if (startX) {
        _this.startX = startX;
      }

      _this.state.indexCurrent.setValue(index);

      if (onSwitching) {
        onSwitching(index, 'move');
      }
    }, _this.handleTouchEnd = function (event, gestureState) {
      if (_this.props.onTouchEnd) {
        _this.props.onTouchEnd(event, gestureState);
      }

      var vx = gestureState.vx,
          moveX = gestureState.moveX;


      var indexLatest = _this.state.indexLatest;
      var indexCurrent = indexLatest + (_this.startX - moveX) / _this.state.viewLength;
      var delta = indexLatest - indexCurrent;

      var indexNew = void 0;

      // Quick movement
      if (Math.abs(vx) * 10 > _this.props.threshold) {
        if (vx > 0) {
          indexNew = Math.floor(indexCurrent);
        } else {
          indexNew = Math.ceil(indexCurrent);
        }
      } else if (Math.abs(delta) > _this.props.hysteresis) {
        // Some hysteresis with indexLatest.
        indexNew = delta > 0 ? Math.floor(indexCurrent) : Math.ceil(indexCurrent);
      } else {
        indexNew = indexLatest;
      }

      var indexMax = _react.Children.count(_this.props.children) - 1;

      if (indexNew < 0) {
        indexNew = 0;
      } else if (indexNew > indexMax) {
        indexNew = indexMax;
      }

      _this.setState({
        indexLatest: indexNew
      }, function () {
        _this.animateIndexCurrent(indexNew);

        if (_this.props.onSwitching) {
          _this.props.onSwitching(indexNew, 'end');
        }

        if (_this.props.onChangeIndex && indexNew !== indexLatest) {
          _this.props.onChangeIndex(indexNew, indexLatest);
        }
      });
    }, _this.handleLayout = function (event) {
      var width = event.nativeEvent.layout.width;


      if (width) {
        _this.setState({
          viewLength: width
        });
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(SwipeableViews, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (process.env.NODE_ENV !== 'production') {
        (0, _reactSwipeableViewsCore.checkIndexBounds)(this.props);
      }

      this.setState({
        indexLatest: this.props.index,
        indexCurrent: new _reactNative.Animated.Value(this.props.index),
        viewLength: _reactNative.Dimensions.get('window').width
      });

      this.panResponder = _reactNative.PanResponder.create({
        // Claim responder if it's a horizontal pan
        onMoveShouldSetPanResponder: function onMoveShouldSetPanResponder(event, gestureState) {
          var dx = Math.abs(gestureState.dx);
          var dy = Math.abs(gestureState.dy);

          return dx > dy && dx > _reactSwipeableViewsCore.constant.UNCERTAINTY_THRESHOLD;
        },
        onPanResponderRelease: this.handleTouchEnd,
        onPanResponderTerminate: this.handleTouchEnd,
        onPanResponderMove: this.handleTouchMove,
        onPanResponderGrant: this.handleTouchStart
      });

      process.env.NODE_ENV !== "production" ? (0, _warning2.default)(!this.props.animateHeight, 'react-swipeable-view: The animateHeight property is not implement yet.') : void 0;
      process.env.NODE_ENV !== "production" ? (0, _warning2.default)(!this.props.axis, 'react-swipeable-view: The axis property is not implement yet.') : void 0;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var index = nextProps.index,
          animateTransitions = nextProps.animateTransitions;


      if (typeof index === 'number' && index !== this.props.index) {
        if (process.env.NODE_ENV !== 'production') {
          (0, _reactSwipeableViewsCore.checkIndexBounds)(nextProps);
        }

        // If true, we are going to change the children. We shoudn't animate it.
        var displaySameSlide = (0, _reactSwipeableViewsCore.getDisplaySameSlide)(this.props, nextProps);

        if (animateTransitions && !displaySameSlide) {
          this.setState({
            indexLatest: index
          }, function () {
            _this2.animateIndexCurrent(index);
          });
        } else {
          this.setState({
            indexLatest: index,
            indexCurrent: new _reactNative.Animated.Value(index)
          });
        }
      }
    }
  }, {
    key: 'animateIndexCurrent',
    value: function animateIndexCurrent(index) {
      // Avoid starting an animation when we are already on the right value.
      if (getAnimatedValue(this.state.indexCurrent) !== index) {
        _reactNative.Animated.spring(this.state.indexCurrent, (0, _extends3.default)({
          toValue: index
        }, this.props.springConfig)).start(this.handleAnimationFinished);
      } else {
        this.handleAnimationFinished({
          finished: true
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          style = _props.style,
          slideStyle = _props.slideStyle,
          containerStyle = _props.containerStyle,
          disabled = _props.disabled,
          hysteresis = _props.hysteresis,
          index = _props.index,
          onTransitionEnd = _props.onTransitionEnd,
          other = (0, _objectWithoutProperties3.default)(_props, ['children', 'style', 'slideStyle', 'containerStyle', 'disabled', 'hysteresis', 'index', 'onTransitionEnd']);
      var _state = this.state,
          indexCurrent = _state.indexCurrent,
          viewLength = _state.viewLength;


      var slideStyleObj = [styles.slide, slideStyle];

      var childrenToRender = _react.Children.map(children, function (child) {
        process.env.NODE_ENV !== "production" ? (0, _warning2.default)((0, _react.isValidElement)(child), 'react-swipeable-view: one of the children provided is invalid: ' + child + '.\nWe are expecting a valid React Element') : void 0;

        return _react2.default.createElement(
          _reactNative.View,
          { style: slideStyleObj },
          child
        );
      });

      var sceneContainerStyle = [styles.container, {
        width: viewLength * _react.Children.count(children),
        transform: [{
          translateX: indexCurrent.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -viewLength]
          })
        }]
      }, containerStyle];

      var panHandlers = disabled ? {} : this.panResponder.panHandlers;

      return _react2.default.createElement(
        _reactNative.View,
        (0, _extends3.default)({ style: [styles.root, style], onLayout: this.handleLayout }, other),
        _react2.default.createElement(
          _reactNative.Animated.View,
          (0, _extends3.default)({}, panHandlers, { style: sceneContainerStyle }),
          childrenToRender
        )
      );
    }
  }]);
  return SwipeableViews;
}(_react.Component);

SwipeableViews.defaultProps = {
  animateTransitions: true,
  disabled: false,
  hysteresis: 0.6,
  index: 0,
  resistance: false,
  springConfig: {
    tension: 300,
    friction: 30
  },
  threshold: 5
};
process.env.NODE_ENV !== "production" ? SwipeableViews.propTypes = {
  /**
   * If `true`, the height of the container will be animated to match the current slide height.
   * Animating another style property has a negative impact regarding performance.
   */
  animateHeight: _propTypes2.default.bool,
  /**
   * If `false`, changes to the index prop will not cause an animated transition.
   */
  animateTransitions: _propTypes2.default.bool,
  /**
   * The axis on which the slides will slide.
   */
  axis: _propTypes2.default.oneOf(['x', 'x-reverse', 'y', 'y-reverse']),
  /**
   * Use this property to provide your slides.
   */
  children: _propTypes2.default.node.isRequired,
  /**
   * This is the inlined style that will be applied
   * to each slide container.
   */
  containerStyle: _reactNative.Animated.View.propTypes.style,
  /**
   * If `true`, it will disable touch events.
   * This is useful when you want to prohibit the user from changing slides.
   */
  disabled: _propTypes2.default.bool,
  /**
   * Configure hysteresis between slides. This value determines how far
   * should user swipe to switch slide.
   */
  hysteresis: _propTypes2.default.number,
  /**
   * This is the index of the slide to show.
   * This is useful when you want to change the default slide shown.
   * Or when you have tabs linked to each slide.
   */
  index: _propTypes2.default.number,
  /**
   * This is callback prop. It's call by the
   * component when the shown slide change after a swipe made by the user.
   * This is useful when you have tabs linked to each slide.
   *
   * @param {integer} index This is the current index of the slide.
   * @param {integer} fromIndex This is the oldest index of the slide.
   */
  onChangeIndex: _propTypes2.default.func,
  /**
   * This is callback prop. It's called by the
   * component when the slide switching.
   * This is useful when you want to implement something corresponding to the current slide position.
   *
   * @param {integer} index This is the current index of the slide.
   * @param {string} type Can be either `move` or `end`.
   */
  onSwitching: _propTypes2.default.func,
  /**
   * @ignore
   */
  onTouchEnd: _react2.default.PropTypes.func,
  /**
   * @ignore
   */
  onTouchStart: _react2.default.PropTypes.func,
  /**
   * The callback that fires when the animation comes to a rest.
   * This is useful to defer CPU intensive task.
   */
  onTransitionEnd: _propTypes2.default.func,
  /**
   * If `true`, it will add bounds effect on the edges.
   */
  resistance: _propTypes2.default.bool,
  /**
   * This is the inlined style that will be applied
   * on the slide component.
   */
  slideStyle: _reactNative.View.propTypes.style,
  /**
   * This is the config given to Animated for the spring.
   * This is useful to change the dynamic of the transition.
   */
  springConfig: _propTypes2.default.shape({
    tension: _propTypes2.default.number,
    friction: _propTypes2.default.number
  }),
  /**
   * This is the inlined style that will be applied
   * on the root component.
   */
  style: _reactNative.View.propTypes.style,
  /**
   * This is the threshold used for detecting a quick swipe.
   * If the computed speed is above this value, the index change.
   */
  threshold: _propTypes2.default.number
} : void 0;
exports.default = SwipeableViews;