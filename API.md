# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### SelfCleanup <a name="SelfCleanup" id="@wheatstalk/cdk8s-self-cleanup.SelfCleanup"></a>

Adds self-cleanup to the chart.

SelfCleanup calculates a hash based on the types and names of all ApiResources that it can find in the chart, then creates a job to delete all labelled resources that don't match the current label hash.

#### Initializers <a name="Initializers" id="@wheatstalk/cdk8s-self-cleanup.SelfCleanup.Initializer"></a>

```typescript
import { SelfCleanup } from '@wheatstalk/cdk8s-self-cleanup'

new SelfCleanup(scope: Construct, id: string, props?: SelfCleanupProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@wheatstalk/cdk8s-self-cleanup.SelfCleanup.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@wheatstalk/cdk8s-self-cleanup.SelfCleanup.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@wheatstalk/cdk8s-self-cleanup.SelfCleanup.Initializer.parameter.props">props</a></code> | <code><a href="#@wheatstalk/cdk8s-self-cleanup.SelfCleanupProps">SelfCleanupProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@wheatstalk/cdk8s-self-cleanup.SelfCleanup.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@wheatstalk/cdk8s-self-cleanup.SelfCleanup.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="@wheatstalk/cdk8s-self-cleanup.SelfCleanup.Initializer.parameter.props"></a>

- *Type:* <a href="#@wheatstalk/cdk8s-self-cleanup.SelfCleanupProps">SelfCleanupProps</a>

---





## Structs <a name="Structs" id="Structs"></a>

### SelfCleanupProps <a name="SelfCleanupProps" id="@wheatstalk/cdk8s-self-cleanup.SelfCleanupProps"></a>

Props for SelfCleanup.

#### Initializer <a name="Initializer" id="@wheatstalk/cdk8s-self-cleanup.SelfCleanupProps.Initializer"></a>

```typescript
import { SelfCleanupProps } from '@wheatstalk/cdk8s-self-cleanup'

const selfCleanupProps: SelfCleanupProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@wheatstalk/cdk8s-self-cleanup.SelfCleanupProps.property.labelName">labelName</a></code> | <code>string</code> | Name of the self-cleanup label. |

---

##### `labelName`<sup>Optional</sup> <a name="labelName" id="@wheatstalk/cdk8s-self-cleanup.SelfCleanupProps.property.labelName"></a>

```typescript
public readonly labelName: string;
```

- *Type:* string
- *Default:* 'self-cleanup'

Name of the self-cleanup label.

---



