# Tutorial：使用 Muta 框架从零开发一条存证链

我们的目标是开发一条存证链，利用区块链的不可篡改和易于追溯的特性，实现存证和查询的功能，旨在通过 step by step 的流程，帮助开发者熟悉 Muta 框架，学会如何使用框架开发自己的区块链。

> 在开始本教程之前，开发者需要先学习 [Service 开发指南](service_dev.md)

我们按照 [Service 开发指南](service_dev.md) 中提到的，使用 Muta 框架开发自己的区块链流程，来开发这条 dex 专有链：

1. 思考自己链的专属需求，确定需要哪些 Service
2. 如果需要的 Service 有现成的，可以直接复用；如果没有，可以自己开发
3. 将这些 Service 接入框架，编译运行！

## 1. 思考需要的 Service

我们需要设计一个 Attestation Service，这个 Service 需要实现的功能有：

1. 一个写方法，将一个待存证的信息存储到链上
2. 一个读方法，能够根据交易 Hash 查询存储到链上面的信息

## 2. 开发存证 Service

### 使用脚手架 muta-drone 对 Service 进行初始化

Service 设计完成后，我们进入开发阶段。我们需要新建一个 rust 工程，同时在工程中引用 Muta Library，好消息是 Muta 框架提供了脚手架 [muta-drone](https://www.npmjs.com/package/muta-drone) 来帮助开发者一键配置工程目录。

- 安装脚手架

```shell
npm install -g muta-drone
```

- 运行 `drone node` 命令，按提示配置工程目录

```shell
-> drone node
    ? The name of your chain. muta-tutorial-dex     // 工程目录命
    ? The chain id of your chain (32-Hash) (default: random generation)     // 回车键使用默认值
    ? Private key of this node (secp256k1) (default: random generation)     // 回车键使用默认值
    ? Verifier's address set, except you (eg. [0x1..., 0x2..])      // 回车键使用默认值
    ? cycles limit 1099511627776        // 回车键使用默认值
    Downloading template....
    Copying template....
    All right, enjoy!
    Enter the following command to start your chain
    $ cd muta-tutorial-dex && cargo run
    When the rust compilation is complete, access graphiql play your chain.
    $ open http://localhost:8000/graphiql
-> 
```

muta-tutorial-dex 目录结构如下：

```shell
./muta-tutorial-dex
├── Cargo.lock
├── Cargo.toml
├── LICENSE
├── README.md
├── config
│   ├── chain.toml
│   └── genesis.toml
├── rust-toolchain
├── services
│   └── metadata
│       ├── Cargo.toml
│       └── src
│           └── lib.rs
└── src
    └── main.rs
```

可以看到，目录主要包含 config，services 和 src 三个子目录：

- config：链的配置信息
- services：包含链的所有 service
- src：这条链的 bin 目录，在 main.rs 中，我们将 services 接入 muta library，并启动整条链

services 目录中包含了一个 [metadata service](https://github.com/nervosnetwork/muta-template/tree/master/node-template/services/metadata)，该 service 为系统内置 service。我们需要在 services 目录中加上 asset service 和 dex service，脚手架 muta-drone 也有命令帮助我们构建 service 目录。

- 运行 `drone service` 命令，构建 service 工程目录

```shell
-> cd muta-tutorial-dex
-> drone service asset
        Downloading template....
        Copying template....
        Done! asset service path /patht/o/muta-tutorial-dex/services/asset
-> drone service dex
        Downloading template....
        Copying template....
        Done! asset service path /path/to/muta-tutorial-dex/services/dex
```

Service 工程目录如下：

```shell
./asset
├── Cargo.toml
├── rust-toolchain
└── src
    ├── lib.rs
    └── types.rs

./dex
├── Cargo.toml
├── rust-toolchain
└── src
    ├── lib.rs
    └── types.rs
```

可以看到 [lib.rs](https://github.com/nervosnetwork/muta-template/blob/master/service-template/src/lib.rs) 和 [types.rs](https://github.com/nervosnetwork/muta-template/blob/master/service-template/src/types.rs) 默认帮我们实现了一个简单的读写 key-value 的 service。



### 代码结构

Service 的组件定义在 lib.rs 中，组件需要用到的数据结构，如输入输出参数(`TransferPayload`)、事件类型(`TransferEvent`)、存储类型(`Asset`)定义在 types.rs 中。

对于存证服务的需求，我们需要一个 Map 类型的数据结构，用交易 Hash 作为存证信息的索引，在 Muta 框架中，提供了 `DefaultStoreMap` 的结构。`AttestationService` 的结构如下：

```rust
pub struct AttestationService<SDK> {
    sdk:               SDK,
    attested_info_map: DefaultStoreMap<Hash, String>,
}
```

下面来实现这两个方法和对应的数据结构

#### 将信息存证到链上

```rust
#[derive(RlpFixedCodec, Deserialize, Serialize, Clone, Debug)]
pub struct AttestInfoPayload {
    pub info: JsonString,
}

#[cycles(21_000)]
#[write]
fn attest_info(
    &mut self, 
    ctx: ServiceContext, 
    payload: AttestInfoPayload
) -> ServiceResponse<Hash> {
    if let Some(hash) = ctx.get_tx_hash() {
        self.attested_info.insert(hash.clone(), payload.info);
        ServiceResponse::from_succeed(hash);
    } else {
        ServiceResponse::from_error(
        	"101", 
        	"Can not get tx hash".to_string(),
    	)
    }
}
```

#### 通过交易 Hash 查询存证信息

```rust
#[derive(RlpFixedCodec, Deserialize, Serialize, Clone, Debug)]
pub struct QueryAttestedInfoPayload {
    pub hash: Hash,
}

#[derive(RlpFixedCodec, Deserialize, Serialize, Clone, Debug)]
pub struct QueryAttestedInfoPayload {
    pub attested_info: JsonString,
}

#[cycles(21_000)]
#[write]
fn query_attested_info(
    &self, 
    ctx: ServiceContext, 
    payload: QueryAttestedInfoPayload
) -> ServiceResponse<QueryAttestedPayload> {
    if let Some(info) = self.attested_info.get(&payload.hash) {
        ServiceResponse::from_succeed(QueryAttestedInfoResponse {
            attested_info: info,
        })
    } else {
        ServiceResponse::from_error(
            "102", 
            "Can not get attested info".to_string(),
        )
    }
}
```

这样就写好了一个存证 Service 的基本逻辑。整个存证 Service 的完整代码在[这里查看](https)。

## 3. 将 Service 接入框架，编译运行！

前面已经提到，这部分工作将在 src 目录的 [main](https://github.com/nervosnetwork/muta-template/blob/master/node-template/src/main.rs) 文件中完成。脚手架下载的 main 文件已经帮我们实现了绝大部分代码，所以这部分工作将变得非常简单。

在模版代码中，定义了一个 `struct DefaultServiceMapping` 结构体，并为该结构体实现了 `trait ServiceMapping`，框架通过 `trait ServiceMapping` 可以获取到所有 service 实例，从而将开发者定义的 service 接入框架底层组件。

```rust
struct DefaultServiceMapping;

impl ServiceMapping for DefaultServiceMapping {
    fn get_service<SDK: 'static + ServiceSDK>(
        &self,
        name: &str,
        sdk: SDK,
    ) -> ProtocolResult<Box<dyn Service>> {
        let service = match name {
            "asset" => Box::new(asset::AssetService::new(sdk)?) as Box<dyn Service>,
            "metadata" => Box::new(metadata::MetadataService::new(sdk)?) as Box<dyn Service>,
            _ => {
                return Err(MappingError::NotFoundService {
                    service: name.to_owned(),
                }
                .into())
            }
        };

        Ok(service)
    }

    fn list_service_name(&self) -> Vec<String> {
        vec!["asset".to_owned(), "metadata".to_owned()]
    }
}
```

`trait ServiceMapping` 包含两个方法，一个 `fn get_service` 用来根据 service 名称获取 service 实例，另一个 `fn list_service_name` 用来获取所有 service 名称。

需要注意的是，框架将使用在 `fn list_service_name` 方法中 service 名称排列的顺序，依次调用 service 中 `#[genesis]` 或 `#[hook_before]` 或 `#[hook_after]` 标记的方法。

我们需要做的，仅仅是把 `fn get_service` 和 `fn list_service_name` 方法中的 service 集合，替换成我们 services 目录中包含的 service 集合：

```rust
struct DefaultServiceMapping;

impl ServiceMapping for DefaultServiceMapping {
    fn get_service<SDK: 'static + ServiceSDK>(
        &self,
        name: &str,
        sdk: SDK,
    ) -> ProtocolResult<Box<dyn Service>> {
        let service = match name {
            "metadata" => Box::new(metadata::MetadataService::new(sdk)?) as Box<dyn Service>,
            "asset" => Box::new(asset::AssetService::new(sdk)?) as Box<dyn Service>,
            "attestation" => Box::new(dex::AttestationService::new(sdk)?) as Box<dyn Service>,
            _ => {
                return Err(MappingError::NotFoundService {
                    service: name.to_owned(),
                }
                .into())
            }
        };

        Ok(service)
    }

    fn list_service_name(&self) -> Vec<String> {
        vec![
            "metadata".to_owned(), 
            "asset".to_owned(), 
            "attestation".to_owned()
        ]
    }
}
```

到这里，所有的开发工作就完成了，运行 `cargo run` 编译并启动 dex 链。

通过浏览器打开 http://localhost:8000/graphiql ，即可与 dex 链进行交互，graphiql 的使用方法参见[文档](graphql_api.md)。


开发一个更加复杂，功能更多的 Service 的例子请参考下一页。 
