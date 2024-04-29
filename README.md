# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Example
<img width="1206" alt="Screenshot 2024-04-29 at 14 54 43" src="https://github.com/lst97/simple-cms-frontend/assets/16495912/b16627f5-8f47-4940-84ab-a9c5eecbd02f">
<img width="1200" alt="Screenshot 2024-04-29 at 14 54 20" src="https://github.com/lst97/simple-cms-frontend/assets/16495912/91dd75f0-5b2a-4a67-b656-45b0c34d5acd">

### Usage Result
<img width="1202" alt="Screenshot 2024-04-29 at 14 55 15" src="https://github.com/lst97/simple-cms-frontend/assets/16495912/eae3d535-4c44-4fe6-a4eb-9d998816d121">
