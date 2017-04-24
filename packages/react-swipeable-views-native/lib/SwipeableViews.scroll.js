'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

var _Dimensions$get = _reactNative.Dimensions.get('window'),
    windowWidth = _Dimensions$get.width; //  weak
/**
 * This is an alternative version that use `ScrollView` and `ViewPagerAndroid`.
 * I'm not sure what version give the best UX experience.
 * I'm keeping the two versions here until we figured out.
 */

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

var SwipeableViews = function (_Component) {
  (0, _inherits3.default)(SwipeableViews, _Component);

  function SwipeableViews() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, SwipeableViews);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = SwipeableViews.__proto__ || (0, _getPrototypeOf2.default)(SwipeableViews)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _this.scrollViewNode = null, _this.handleScroll = function (event) {
      // Filters out when changing the children
      if (_this.state.displaySameSlide) {
        return;
      }

      if (_this.props.onSwitching) {
        _this.props.onSwitching(event.nativeEvent.contentOffset.x / _this.state.viewWidth, 'move');
      }
    }, _this.handleMomentumScrollEnd = function (event) {
      var indexNew = event.nativeEvent.contentOffset.x / _this.state.viewWidth;
      var indexLatest = _this.state.indexLatest;

      _this.setState({
        indexLatest: indexNew
      }, function () {
        if (_this.props.onSwitching) {
          _this.props.onSwitching(indexNew, 'end');
        }

        if (_this.props.onChangeIndex && indexNew !== indexLatest) {
          _this.props.onChangeIndex(indexNew, indexLatest);
        }

        if (_this.props.onTransitionEnd) {
          _this.props.onTransitionEnd();
        }
      });
    }, _this.handleLayout = function (event) {
      var width = event.nativeEvent.layout.width;


      if (width) {
        _this.setState({
          viewWidth: width,
          offset: {
            x: _this.state.indexLatest * width }
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
        viewWidth: windowWidth,
        offset: {
          x: windowWidth * this.props.index
        }
      });

      process.env.NODE_ENV !== "production" ? (0, _warning2.default)(!this.props.animateHeight, 'react-swipeable-view: The animateHeight property is not implement yet.') : void 0;
      process.env.NODE_ENV !== "production" ? (0, _warning2.default)(!this.props.axis, 'react-swipeable-view: The axis property is not implement yet.') : void 0;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var index = nextProps.index;


      if (typeof index === 'number' && index !== this.props.index) {
        if (process.env.NODE_ENV !== 'production') {
          (0, _reactSwipeableViewsCore.checkIndexBounds)(nextProps);
        }

        // If true, we are going to change the children. We shoudn't animate it.
        var displaySameSlide = (0, _reactSwipeableViewsCore.getDisplaySameSlide)(this.props, nextProps);

        this.setState({
          displaySameSlide: displaySameSlide,
          indexLatest: index
        }, function () {
          if (_this2.scrollViewNode) {
            _this2.scrollViewNode.scrollTo({
              x: _this2.state.viewWidth * index,
              y: 0,
              animated: _this2.props.animateTransitions && !displaySameSlide
            });
          }
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          resistance = _props.resistance,
          children = _props.children,
          slideStyle = _props.slideStyle,
          style = _props.style,
          containerStyle = _props.containerStyle,
          disabled = _props.disabled,
          onTransitionEnd = _props.onTransitionEnd,
          other = (0, _objectWithoutProperties3.default)(_props, ['resistance', 'children', 'slideStyle', 'style', 'containerStyle', 'disabled', 'onTransitionEnd']);
      var _state = this.state,
          viewWidth = _state.viewWidth,
          indexLatest = _state.indexLatest,
          offset = _state.offset;


      var slideStyleObj = [styles.slide, {
        width: viewWidth
      }, slideStyle];

      var childrenToRender = _react.Children.map(children, function (child, index) {
        if (disabled && indexLatest !== index) {
          return null;
        }

        process.env.NODE_ENV !== "production" ? (0, _warning2.default)((0, _react.isValidElement)(child), 'react-swipeable-view: one of the children provided is invalid: ' + child + '.\nWe are expecting a valid React Element') : void 0;

        return _react2.default.createElement(
          _reactNative.View,
          { style: slideStyleObj },
          child
        );
      });

      return _react2.default.createElement(
        _reactNative.View,
        (0, _extends3.default)({
          onLayout: this.handleLayout,
          style: [styles.root, style]
        }, other),
        _react2.default.createElement(
          _reactNative.ScrollView,
          {
            ref: function ref(node) {
              _this3.scrollViewNode = node;
            },
            horizontal: true,
            pagingEnabled: true,
            automaticallyAdjustContentInsets: false,
            scrollsToTop: false,
            bounces: resistance,
            onScroll: this.handleScroll,
            scrollEventThrottle: 16,
            showsHorizontalScrollIndicator: false,
            directionalLockEnabled: true,
            contentOffset: offset,
            onMomentumScrollEnd: this.handleMomentumScrollEnd,
            alwaysBounceVertical: false,
            keyboardDismissMode: 'on-drag',
            style: [styles.container, containerStyle]
          },
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
  index: 0,
  resistance: false
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
  children: _propTypes2.default.node,
  /**
   * This is the inlined style that will be applied
   * to each slide container.
   */
  containerStyle: _reactNative.ScrollView.propTypes.style,
  /**
   * If `true`, it will disable touch events.
   * This is useful when you want to prohibit the user from changing slides.
   */
  disabled: _propTypes2.default.bool,
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
   * This is the inlined style that will be applied
   * on the root component.
   */
  style: _reactNative.View.propTypes.style
} : void 0;
exports.default = SwipeableViews;