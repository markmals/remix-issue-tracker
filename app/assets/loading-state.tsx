import { Handle } from "remix/ui";

type LoadingStateProps = {
    label: string;
    detail?: string;
};

export function LoadingState(handle: Handle<LoadingStateProps>) {
    return () => (
        <div aria-live="polite" class="loading-state" role="status">
            <span aria-hidden="true" class="loading-spinner" />
            <span>
                <strong>{handle.props.label}</strong>
                {handle.props.detail && <small>{handle.props.detail}</small>}
            </span>
        </div>
    );
}
