# Super Studio AGENTS.md file


## Agent Profile

You are a **senior fullstack developer** with expertise in **Next js** and **React**.

* Follow **clean programming** and **design patterns**.
* Generate **code, corrections, and refactorings** that comply with established principles and project nomenclature.
* Base on documents feature implement it.


tip: generate task list with this priority: prisma schema -> api -> frontend


---
## Core Architecture

* **Framework**: next js (backend) and next js (frontend)
* **Package Manager**: pnpm
* **Database**: PostgreSQL with Prisma ORM
* **Authentication**: Better Auth (organization plugin)
* **UI Framework**: TailwindCSS + MagicUI + Shadcn/UI
* **State Management**: Zustand
* **Linting**:Biome
* **Formatting**: Biome
* **Type Checking**: TypeScript
* **API Client**: React Query & server API call
* **commend system**: windows
---

## commands 


## Module & Directory Structure


### frontend-app Structure

    src/
    ├── modules/
    │   ├── [*]/
    │   │   ├── index.tsx           # module component 
    │   │   └── constants.ts        # specific module's constants (constants)   
    │   │   └── components/         # specific module's components 
    │   │   │   ├── [*]/
    │   │   │   │   ├── index.tsx
    │   │   └── hooks/              # specific module's hooks (logic)
    │   │   │   │   ├── *.ts
    │   │   │   │   ├── *.ts
    │   │   └── stores/             # specific module's stores (state management)
    │   │   │   │   ├── *.ts
    │   │   └── utils/              # specific module's utils (helpers)
    │   │   │   │   ├── *.ts
    │   │   └── models/             # specific module's models (interfaces and types for hooks & state management)
    │   │   │   │   ├── *.ts
    ├── infrastructure/             # custom infrastructure 
    │   │   └── router.tsx          # routers for the app
    │   │   └── components/       
        │   │   │   ├── root.tsx    # main app component for the app
    ├── shared/
    │   ├── hooks/                  # custom hooks 
    │   ├── models/                 # custom models 
    │   ├── stores/                 # custom stores 
    │   ├── lib/                    # custom libraries 
    │   ├── utils/                  # custom helpers 
    │   ├── constants/              # custom constants 
    │   ├── components/             # custom components  
    │   │   ├──ui/                  # shadcn components
    ├── app.tsx                     # main app component 
    └── index.html                  # main entry point 


---

## Integration Points

* **Database**: PostgreSQL + Prisma migrations, UUID PKs, strong FKs, cascading

---

## Component Workflow:

### Always Check Registry First
1. all shared components should be in shared/components/ui, first go to shared/components/ui and start your process from there.
2. Before creating custom components, search the registry for existing ones ./COMPONENTS_DOC.md
3. Use shadcn mcp 
4. Do not overwrite UI or registry configuration.

---

## Design Style
•mobile first design
•all design should be in farsi and right to left.
•A perfect balance between elegant minimalism and functional design, mobile first.
•Light and immersive user experience.
•Clear information hierarchy using subtle shadows and modular card layouts.
•Natural focus on core functionalities.
•Refined rounded corners.
•Delicate micro-interactions.
•Comfortable visual proportions.
• theme doc ./THEME_DOC.md
• components doc magicui mcp and ./COMPONENTS_DOC.md
• Priority using kokonutui and magicui components  then ui components


---