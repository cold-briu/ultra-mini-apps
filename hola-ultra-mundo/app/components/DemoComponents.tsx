"use client";

import { type ReactNode, useCallback, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import {
  Transaction,
  TransactionButton,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionError,
  TransactionResponse,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionStatus,
} from "@coinbase/onchainkit/transaction";
import { useNotification } from "@coinbase/onchainkit/minikit";
import { useSafeAvalanche } from "../../hooks/useSafeAvalanche";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  icon,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0052FF] disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    primary:
      "bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[var(--app-background)]",
    secondary:
      "bg-[var(--app-gray)] hover:bg-[var(--app-gray-dark)] text-[var(--app-foreground)]",
    outline:
      "border border-[var(--app-accent)] hover:bg-[var(--app-accent-light)] text-[var(--app-accent)]",
    ghost:
      "hover:bg-[var(--app-accent-light)] text-[var(--app-foreground-muted)]",
  };

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1.5 rounded-md",
    md: "text-sm px-4 py-2 rounded-lg",
    lg: "text-base px-6 py-3 rounded-lg",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="flex items-center mr-2">{icon}</span>}
      {children}
    </button>
  );
}

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

function Card({
  title,
  children,
  className = "",
  onClick,
}: CardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden transition-all hover:shadow-xl ${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {title && (
        <div className="px-5 py-3 border-b border-[var(--app-card-border)]">
          <h3 className="text-lg font-medium text-[var(--app-foreground)]">
            {title}
          </h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

type FeaturesProps = {
  setActiveTab: (tab: string) => void;
};

export function Features({ setActiveTab }: FeaturesProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Key Features">
        <ul className="space-y-3 mb-4">
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              Minimalistic and beautiful UI design
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              Responsive layout for all devices
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              Dark mode support
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              OnchainKit integration
            </span>
          </li>
        </ul>
        <Button variant="outline" onClick={() => setActiveTab("home")}>
          Back to Home
        </Button>
      </Card>
    </div>
  );
}

type FundsProps = {
  setActiveTab: (tab: string) => void;
};

export function Funds({ setActiveTab }: FundsProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <FundsSection />
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => setActiveTab("home")}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}

type HomeProps = {
  setActiveTab: (tab: string) => void;
};

export function Home({ setActiveTab }: HomeProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-center">
        <Button
          onClick={() => setActiveTab("funds")}
          variant="secondary"
          icon={<Icon name="wallet" size="sm" />}
        >
          View Funds
        </Button>
      </div>
    </div>
  );
}

type IconProps = {
  name: "heart" | "star" | "check" | "plus" | "arrow-right" | "wallet" | "external-link" | "shield" | "users" | "refresh";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Icon({ name, size = "md", className = "" }: IconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const icons = {
    heart: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Heart</title>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    star: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Star</title>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    check: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Check</title>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    plus: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Plus</title>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    "arrow-right": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Arrow Right</title>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
    wallet: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Wallet</title>
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
    ),
    "external-link": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>External Link</title>
        <path d="M15 3h6v6" />
        <path d="M10 14 21 3" />
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      </svg>
    ),
    shield: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Shield</title>
        <path d="M20 13c0 5-3.5 7.5-8 7.5s-8-2.5-8-7.5c0-2.91.48-5.35 1.34-7.24A2 2 0 0 1 7.24 4h9.52a2 2 0 0 1 1.9 1.76C19.52 7.65 20 10.09 20 13Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    users: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Users</title>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    refresh: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Refresh</title>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M3 21v-5h5" />
      </svg>
    ),
  };

  return (
    <span className={`inline-block ${sizeClasses[size]} ${className}`}>
      {icons[name]}
    </span>
  );
}

type Todo = {
  id: number;
  text: string;
  completed: boolean;
}

type MetricCardProps = {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  variant?: "funds" | "default";
  icon?: ReactNode;
  className?: string;
}

function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  variant = "default",
  icon,
  className = "",
}: MetricCardProps) {
  const variantClasses = {
    funds: "border-[#22c55e]/15 bg-gradient-to-br from-[#22c55e]/5 to-transparent",
    default: "border-[var(--app-card-border)] bg-[var(--app-card-bg)]",
  };

  const changeTypeClasses = {
    positive: "text-[#22c55e]",
    negative: "text-[#ef4444]",
    neutral: "text-[var(--app-foreground-muted)]",
  };

  return (
    <div
      className={`p-4 rounded-xl border backdrop-blur-md transition-all hover:shadow-lg ${variantClasses[variant]} ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-[var(--app-foreground-muted)]">
          {title}
        </span>
        {icon && (
          <span className={variant === "funds" ? "text-[#22c55e]" : "text-[var(--app-accent)]"}>
            {icon}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-[var(--app-foreground)]">
          {value}
        </div>
        {change && (
          <div className={`text-xs ${changeTypeClasses[changeType]}`}>
            {change}
          </div>
        )}
      </div>
    </div>
  );
}

export function FundsSection() {
  const { owners, threshold, fiatTotal, tokens, loading, error, refresh } = useSafeAvalanche();

  if (error) return <div className="text-[var(--app-foreground)] p-4">Error: {error}</div>;
  if (loading) return <div className="text-[var(--app-foreground)] p-4">Loading Safe data...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#22c55e]/15">
              <Icon name="wallet" className="text-[#22c55e]" />
            </div>
            <span className="text-[#22c55e]">FUNDS & FINANCE</span>
          </h2>
          <p className="text-sm text-[var(--app-foreground-muted)] ml-11">
            Community treasury and multisig management
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={refresh}
          disabled={loading}
          className="text-[#22c55e] hover:bg-[#22c55e]/10"
          icon={<Icon name="refresh" size="sm" className={loading ? "animate-spin" : ""} />}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Multisig Avalanche"
          value={`$${fiatTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          change={`${owners.length} multisigners`}
          changeType="positive"
          variant="funds"
          icon={<Icon name="shield" size="sm" />}
        />
        <MetricCard
          title="Required Signatures (AVAX)"
          value={`${threshold}/${owners.length}`}
          change="to execute transactions"
          changeType="neutral"
          variant="funds"
          icon={<Icon name="users" size="sm" />}
        />
        <MetricCard
          title="Multisig Solana"
          value="$0"
          change="10 multisigners"
          changeType="neutral"
          variant="funds"
          icon={<Icon name="shield" size="sm" />}
        />
        <MetricCard
          title="Required Signatures (SOL)"
          value="6/10"
          change="to execute transactions"
          changeType="neutral"
          variant="funds"
          icon={<Icon name="users" size="sm" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mt-8">
        <div className="space-y-4">
          <h3 className="text-base font-semibold uppercase tracking-wide text-[var(--app-foreground-muted)]">
            Multisig Avalanche
          </h3>
          <div className="p-5 rounded-xl border border-[#22c55e]/15 bg-gradient-to-br from-[#22c55e]/5 to-transparent">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-[var(--app-foreground)]">Community Vault</span>
                <Button variant="ghost" size="sm" className="h-6 p-1">
                  <a
                    href="https://app.safe.global/balances?safe=avax:0x52110a2Cc8B6bBf846101265edAAe34E753f3389"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <Icon name="external-link" size="sm" />
                  </a>
                </Button>
              </div>

              <div className="space-y-3">
                <ul className="space-y-2">
                  {tokens
                    .filter(token => Number(token.fiatBalance) >= 1)
                    .slice(0, 5)
                    .map((token, idx) => (
                      <li
                        key={token.tokenInfo.address + idx}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[var(--app-background)]/50 hover:bg-[#22c55e]/10 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <img
                            src={token.tokenInfo.logoUri}
                            alt={token.tokenInfo.symbol}
                            className="w-6 h-6 rounded-full border flex-shrink-0"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = "data:image/svg+xml,%3csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='24' height='24' rx='12' fill='%23e5e7eb'/%3e%3ctext x='12' y='16' text-anchor='middle' fill='%236b7280' font-size='12' font-family='system-ui'%3e?%3c/text%3e%3c/svg%3e";
                            }}
                          />
                          <span className="font-medium flex-shrink-0 text-[var(--app-foreground)]">{token.tokenInfo.symbol}</span>
                          <span className="text-xs text-[var(--app-foreground-muted)] truncate hidden sm:block">
                            {token.tokenInfo.name}
                          </span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-sm sm:text-base text-[var(--app-foreground)]">
                            {(Number(token.balance) / 10 ** token.tokenInfo.decimals).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-xs text-[var(--app-foreground-muted)]">
                            ${Number(token.fiatBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-semibold uppercase tracking-wide text-[var(--app-foreground-muted)]">
            Multisig Solana
          </h3>
          <div className="p-5 rounded-xl border border-[#22c55e]/15 bg-gradient-to-br from-[#22c55e]/5 to-transparent">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-[var(--app-foreground)]">Community Vault</span>
                <Button variant="ghost" size="sm" className="h-6 p-1">
                  <a
                    href="https://app.squads.so/squads/6ye76CffLefSQa9zbfGRDReQekm2deFTYNYh5953B6yi/treasury/6ye76CffLefSQa9zbfGRDReQekm2deFTYNYh5953B6yi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <Icon name="external-link" size="sm" />
                  </a>
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-[var(--app-background)]/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white">
                      S
                    </div>
                    <span className="font-medium text-[var(--app-foreground)]">SOL</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[var(--app-foreground)]">0</div>
                    <div className="text-xs text-[var(--app-foreground-muted)]">
                      ~$0
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Learn about MiniKit", completed: false },
    { id: 2, text: "Build a Mini App", completed: true },
    { id: 3, text: "Deploy to Base and go viral", completed: false },
  ]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim() === "") return;

    const newId =
      todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
    setTodos([...todos, { id: newId, text: newTodo, completed: false }]);
    setNewTodo("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <Card title="Get started">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
          />
          <Button
            variant="primary"
            size="md"
            onClick={addTodo}
            icon={<Icon name="plus" size="sm" />}
          >
            Add
          </Button>
        </div>

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  id={`todo-${todo.id}`}
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${todo.completed
                    ? "bg-[var(--app-accent)] border-[var(--app-accent)]"
                    : "border-[var(--app-foreground-muted)] bg-transparent"
                    }`}
                >
                  {todo.completed && (
                    <Icon
                      name="check"
                      size="sm"
                      className="text-[var(--app-background)]"
                    />
                  )}
                </button>
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`text-[var(--app-foreground-muted)] cursor-pointer ${todo.completed ? "line-through opacity-70" : ""}`}
                >
                  {todo.text}
                </label>
              </div>
              <button
                type="button"
                onClick={() => deleteTodo(todo.id)}
                className="text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}


function TransactionCard() {
  const { address } = useAccount();

  // Example transaction call - sending 0 ETH to self
  const calls = useMemo(() => address
    ? [
      {
        to: address,
        data: "0x" as `0x${string}`,
        value: BigInt(0),
      },
    ]
    : [], [address]);

  const sendNotification = useNotification();

  const handleSuccess = useCallback(async (response: TransactionResponse) => {
    const transactionHash = response.transactionReceipts[0].transactionHash;

    console.log(`Transaction successful: ${transactionHash}`);

    await sendNotification({
      title: "Congratulations!",
      body: `You sent your a transaction, ${transactionHash}!`,
    });
  }, [sendNotification]);

  return (
    <Card title="Make Your First Transaction">
      <div className="space-y-4">
        <p className="text-[var(--app-foreground-muted)] mb-4">
          Experience the power of seamless sponsored transactions with{" "}
          <a
            href="https://onchainkit.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0052FF] hover:underline"
          >
            OnchainKit
          </a>
          .
        </p>

        <div className="flex flex-col items-center">
          {address ? (
            <Transaction
              calls={calls}
              onSuccess={handleSuccess}
              onError={(error: TransactionError) =>
                console.error("Transaction failed:", error)
              }
            >
              <TransactionButton className="text-white text-md" />
              <TransactionStatus>
                <TransactionStatusAction />
                <TransactionStatusLabel />
              </TransactionStatus>
              <TransactionToast className="mb-4">
                <TransactionToastIcon />
                <TransactionToastLabel />
                <TransactionToastAction />
              </TransactionToast>
            </Transaction>
          ) : (
            <p className="text-yellow-400 text-sm text-center mt-2">
              Connect your wallet to send a transaction
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
