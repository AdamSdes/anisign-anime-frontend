import { ReactElement, SVGProps } from 'react';

export function Star(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path d="M12 2.25l2.625 5.637a6 6 0 004.337 3.625l5.639.82-4.625 4.5a6 6 0 00-1.706 5.25L12 22.5l-4.27-6.638a6 6 0 00-1.706-5.25l-4.625-4.5 5.639-.82a6 6 0 004.337-3.625L12 2.25z" />
    </svg>
  );
}

export function Calendar(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15.75 13.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
    </svg>
  );
}

export function Left(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
    </svg>
  );
}

export function UserNoAvatar(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
  );
}

export function Mail(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
    </svg>
  );
}

export function Lock(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3a.75.75 0 01-1.5 0v-3a5.25 5.25 0 1110.5 0v3a.75.75 0 01-1.5 0z" clipRule="evenodd" />
    </svg>
  );
}

export function Eye(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
    </svg>
  );
}

export function Bell(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clipRule="evenodd" />
    </svg>
  );
}

export function YouTube(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 01-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 01-1.768-1.768C2 15.255 2 12 2 12s0-3.255.418-4.814a2.507 2.507 0 011.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12L10 15V9l5.194 3Z" clipRule="evenodd" />
    </svg>
  );
}

export function Filter(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path fillRule="evenodd" d="M3 6a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zm3 6a1 1 0 011-1h10a1 1 0 110 2H7a1 1 0 01-1-1zm4 5a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  );
}

export function Sort(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l3.75 3.75a.75.75 0 01-1.06 1.06l-2.47-2.47V21a.75.75 0 01-1.5 0V4.81l-2.47 2.47a.75.75 0 01-1.06-1.06l3.75-3.75z" clipRule="evenodd" />
    </svg>
  );
}

export function Search(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
    </svg>
  );
}

export function Clock(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 6.75a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0V7.5a.75.75 0 01.75-.75zM12 20.25a8.25 8.25 0 100-16.5 8.25 8.25 0 000 16.5z" clipRule="evenodd" />
    </svg>
  );
}

export function ChevronDown(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v13.19l5.47-5.47a.75.75 0 111.06 1.06l-6.75 6.75a.75.75 0 01-1.06 0l-6.75-6.75a.75.75 0 111.06-1.06l5.47 5.47V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
  );
}

export function UserIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM7.5 8.25a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM12 14.25a7.5 7.5 0 00-7.5 7.5c0 .414.336.75.75.75h14a.75.75 0 00.75-.75 7.5 7.5 0 00-7.5-7.5z" clipRule="evenodd" />
    </svg>
  );
}

export function VK(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15v-2h-2v-2h2v-1c0-1.1.9-2 2-2h1v2h-1c-.55 0-1 .45-1 1v1h2v2h-2v2h-2zm4-8h-2v-2h2v2z" />
    </svg>
  );
}

export function Telegram(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.87 3.66 12c-.71-.28-1.03-.76-.52-1.3L22.7 3.45c.59-.34 1.23.14 1.03 1L19.4 20.8c-.2.84-.88 1.16-1.7.67l-4.3-2.82z" />
    </svg>
  );
}

export function Discord(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6085 1.2494-1.8885-.3012-3.7661-.3012-5.6546 0-.1638-.3846-.3974-.8741-.6085-1.2494a.077.077 0 00-.0785-.0371 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.109 18.0786a.0734.0734 0 00.0768.0593c1.4858-2.3994 4.6889-3.9278 7.9733-3.7938a.077.077 0 00.084-.0733v-.3451c-2.7068-.2688-5.0422-.9108-6.2592-2.034a.0773.0773 0 01-.0076-.1277 11.1474 11.1474 0 006.3266-1.8106.0785.0785 0 00.0893-.0266l.415-2.9784a.0749.0749 0 00-.0616-.0874 12.3946 12.3946 0 01-3.6597-.3802.0742.0742 0 00-.0836.0356 13.796 13.796 0 00-1.2999 5.3577.077.077 0 00.053.0874c2.6536.9974 5.6874 1.0021 8.3245 0a.077.077 0 00.053-.0874 13.796 13.796 0 00-1.2999-5.3577.0739.0739 0 00-.0836-.0356 12.3946 12.3946 0 01-3.6597.3802.0749.0749 0 00-.0616.0874l.415 2.9784a.0785.0785 0 00.0893.0266 11.1474 11.1474 0 006.3266 1.8106.0773.0773 0 01-.0076.1277c-1.217 1.1232-3.5524 1.7653-6.2592 2.034v.3451a.077.077 0 00.084.0733c3.2844-.134 6.4875 1.3944 7.9733 3.7938a.0734.0734 0 00.0768-.0593c.4276-8.4987-1.5402-12.9668-6.5446-13.6811a.0699.0699 0 00-.0321-.0277z" />
    </svg>
  );
}

export function ViewHistory(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 6.75a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0V7.5a.75.75 0 01.75-.75zM12 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
      <path d="M15.53 14.47a.75.75 0 00-1.06-1.06l-2.5 2.5a.75.75 0 000 1.06l2.5 2.5a.75.75 0 101.06-1.06L13.56 16l1.97-1.97z" />
    </svg>
  );
}

export function Google(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      className="w-5 h-5"
    >
      <path fill="#4285F4" d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972c-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748L12.545 10.239z" />
      <path fill="#34A853" d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972" />
      <path fill="#FBBC05" d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972c-3.332 0-6.033-2.701-6.033-6.032" />
      <path fill="#EA4335" d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972c-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032" />
    </svg>
  );
}

export function DiscordAuth(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      className="w-5 h-5"
    >
      <path fill="#7289DA" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6085 1.2494-1.8885-.3012-3.7661-.3012-5.6546 0-.1638-.3846-.3974-.8741-.6085-1.2494a.077.077 0 00-.0785-.0371 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.109 18.0786a.0734.0734 0 00.0768.0593c1.4858-2.3994 4.6889-3.9278 7.9733-3.7938a.077.077 0 00.084-.0733v-.3451c-2.7068-.2688-5.0422-.9108-6.2592-2.034a.0773.0773 0 01-.0076-.1277 11.1474 11.1474 0 006.3266-1.8106.0785.0785 0 00.0893-.0266l.415-2.9784a.0749.0749 0 00-.0616-.0874 12.3946 12.3946 0 01-3.6597-.3802.0742.0742 0 00-.0836.0356 13.796 13.796 0 00-1.2999 5.3577.077.077 0 00.053.0874c2.6536.9974 5.6874 1.0021 8.3245 0a.077.077 0 00.053-.0874 13.796 13.796 0 00-1.2999-5.3577.0739.0739 0 00-.0836-.0356 12.3946 12.3946 0 01-3.6597.3802.0749.0749 0 00-.0616.0874l.415 2.9784a.0785.0785 0 00.0893.0266 11.1474 11.1474 0 006.3266 1.8106.0773.0773 0 01-.0076.1277c-1.217 1.1232-3.5524 1.7653-6.2592 2.034v.3451a.077.077 0 00.084.0733c3.2844-.134 6.4875 1.3944 7.9733 3.7938a.0734.0734 0 00.0768-.0593c.4276-8.4987-1.5402-12.9668-6.5446-13.6811a.0699.0699 0 00-.0321-.0277z" />
    </svg>
  );
}