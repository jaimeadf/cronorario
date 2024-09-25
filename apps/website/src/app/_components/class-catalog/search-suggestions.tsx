import { HTMLAttributes, ReactNode } from "react";
import { Book, Icon, Search, User } from "react-feather";

import { cn } from "@/lib/utils";

interface SearchSectionProps {
  title: string;
  children?: ReactNode;
}

interface SearchSuggestionProps extends HTMLAttributes<HTMLDivElement> {
  icon: Icon;
  label: string;
}

interface SearchSuggestionsProps {
  input: string;
}

function SearchSection({ title, children }: SearchSectionProps) {
  return (
    <div className="flex flex-col">
      <div className="p-2 border-b font-medium border-secondary text-primary">{title}</div>
      {children}
    </div>
  )
}

function SearchSuggestion({ className, icon, label }: SearchSuggestionProps) {
  const Icon = icon;
  
  return (
    <div className={cn(
      "group border-b border-secondary hover:outline hover:outline-bg-primary hover:border-transparent",
      className
      )}
    >
      <div className="flex gap-2 p-2 rounded-lg bg-primary group-hover:bg-primary-hover">
        <Icon className="size-6 text-brand" />
        <div className="text-primary">{label}</div>
      </div>
    </div>
  );
}


export function SearchSuggestions({ input }: SearchSuggestionsProps) {
  return (
    <div className="flex flex-col gap-4 border-t border-secondary">
      <SearchSuggestion icon={Search} label={input} />
      <SearchSection title="Cursos">
        <SearchSuggestion icon={Book} label="Cálculo A" />
        <SearchSuggestion icon={Book} label="Cálculo B" />
      </SearchSection>
      <SearchSection title="Professores">
        <SearchSuggestion icon={User} label="Steve No Jobs" />
        <SearchSuggestion icon={User} label="Steve No Jobs" />
        <SearchSuggestion icon={User} label="Steve No Jobs" />
        <SearchSuggestion icon={User} label="Steve No Jobs" />
        <SearchSuggestion icon={User} label="Steve No Jobs" />
        <SearchSuggestion icon={User} label="Steve No Jobs" />
        <SearchSuggestion icon={User} label="Steve No Jobs" />
        <SearchSuggestion icon={User} label="Steve No Jobs" />
        <SearchSuggestion icon={User} label="Steve No Jobs" />
        <SearchSuggestion icon={User} label="Steve No Jobs" />
        <SearchSuggestion icon={User} label="Steve No Jobs" />
        <SearchSuggestion icon={User} label="Steve No Jobs" />
        <SearchSuggestion icon={User} label="Steve No Jobs" />
        <SearchSuggestion icon={User} label="Zuker Markberg" />
      </SearchSection>
    </div>
  );
}