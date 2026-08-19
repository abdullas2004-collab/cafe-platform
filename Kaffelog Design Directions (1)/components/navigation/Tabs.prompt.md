Underline tab bar for switching between screens/sections (Today / Milk / Logs / SafeVault / Reports).

```jsx
<Tabs items={[{value:'today',label:'Today'},{value:'milk',label:'Milk'}]} active="today" onChange={setTab} />
```

Active tab underlines in rust; inactive labels stay muted mono caps. Never more than 6 tabs in one row — use a select for overflow.
