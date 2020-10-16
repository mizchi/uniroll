# Uniroll Vue

Uniroll for Vue


## :cd: Installation

```sh
# if you use Yarn, you can install with `yarn add uniroll-vue`
$ npm install --save uniroll-vue
```


## :lollipop: Example
See the `playground` directory. 

You can play by running the following command:

```sh
$ yarn          # install `uniroll-vue` deps
$ yarn build    # build `uniroll-vue` package
$ cd playground
$ yarn install  # install playground deps
$ yarn start    # run the playground !
```


## :warning: Limitations
At the moment, there are the following limitations for Vue:

- Vue SFC `script` block lang: **javascript** and **typescript**
- Vue SFC `template` block lang: **html** only
  - Since preprocessor is disabled, `pug` and other template languages are not available
- Vue SFC `style` block lang: **css** only
  - Since preprocessor is disabled, `sass`, `postcss` and other template languages are not available


## :white_check_mark: TODOs
- [ ] unit testing
- [ ] documentation
- [ ] template preprocessor supporting
- [ ] style preprocessor supporting
- [ ] and more!


## :copyright: License

[MIT](http://opensource.org/licenses/MIT)

- Kazuya Kawaguchi - [@kazu_pon](https://twitter.com/kazu_pon)
