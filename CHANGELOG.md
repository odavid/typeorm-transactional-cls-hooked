# 0.1.20
* Feature request: make NAMESPACE_NAME exported [#82](https://github.com/odavid/typeorm-transactional-cls-hooked/issues/82)

## 0.1.19
* Introduced TRANSACTIONAL_CONSOLE_DEBUG environment variable to control debug logging when connection logger is not available [#76](https://github.com/odavid/typeorm-transactional-cls-hooked/pull/76)

## 0.1.18
* Error when using repository methods outside of a request context [#73](https://github.com/odavid/typeorm-transactional-cls-hooked/issues/73)

## 0.1.17
* Added Transactional Debug Logs - Using Typeorm connection logger [#69](https://github.com/odavid/typeorm-transactional-cls-hooked/pull/69)

## 0.1.16
* Re-patch MongoRepisotry manager property to be configurable/writable [#68](https://github.com/odavid/typeorm-transactional-cls-hooked/pull/68)

## 0.1.15
* Patching mongo repository [#67](https://github.com/odavid/typeorm-transactional-cls-hooked/pull/67)

## 0.1.14
* Using patchRepositoryManager instead of overriding the manager() [#66](https://github.com/odavid/typeorm-transactional-cls-hooked/pull/66)


## 0.1.13
* Fix partial rollback issue [#61](https://github.com/odavid/typeorm-transactional-cls-hooked/pull/61)
* Using github actions for CI
* Using npm instead of yarn during development
* Simple tests

## 0.1.12
* Using connectionName as string | ()=>string [#44](https://github.com/odavid/typeorm-transactional-cls-hooked/issues/44)

## 0.1.11
* Move @types/cls-hooked to dependencies [#42](https://github.com/odavid/typeorm-transactional-cls-hooked/issues/42)

## 0.1.10
* dist folder missing in package version 0.1.9 [#33](https://github.com/odavid/typeorm-transactional-cls-hooked/issues/33)

## 0.1.9 (Use 0.1.10 instead)
* feat: adds BaseTreeRepository [#32](https://github.com/odavid/typeorm-transactional-cls-hooked/pull/32)

## 0.1.8
* Preserve method name on @Transactional method overwrite [#16](https://github.com/odavid/typeorm-transactional-cls-hooked/pull/16)

## 0.1.7
* Added types declaration in package.json [#20](https://github.com/odavid/typeorm-transactional-cls-hooked/pull/20)

## 0.1.6
* cls-hooked should be a dependency [#17](https://github.com/odavid/typeorm-transactional-cls-hooked/issues/17)

## 0.1.5
* Removed reflect-metadata import and added a comment within the readme [#12](https://github.com/odavid/typeorm-transactional-cls-hooked/pull/12)
* Export getEntityManagerOrTransactionManager for usage in custom repositories [#13](https://github.com/odavid/typeorm-transactional-cls-hooked/pull/13)
* Added patchTypeORMRepositoryWithBaseRepository [#14](https://github.com/odavid/typeorm-transactional-cls-hooked/pull/14)


## 0.1.4
* add basic support for transation lifecycle hooks [#7](https://github.com/odavid/typeorm-transactional-cls-hooked/pull/7)

## 0.1.3
* feature: add ability to specify isolation level of transactions [#5](https://github.com/odavid/typeorm-transactional-cls-hooked/pull/5)


